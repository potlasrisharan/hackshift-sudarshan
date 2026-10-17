"""Regression checks use a published sample and invalid request boundaries."""
from pathlib import Path
import hashlib
import json
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from api.main import app

SAMPLE = dict(wbc=8.95, rbc=4.41, neutrophils=65, lymphocytes=25, monocytes=9)


class ModelAPITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.client.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client.__exit__(None, None, None)

    def test_frozen_artifact_identity(self):
        root = Path(__file__).resolve().parents[1] / 'bundle'
        digest = hashlib.sha256((root / 'model.joblib').read_bytes()).hexdigest()
        self.assertEqual(digest, 'c87ec848515906247b77e9764953a9969c4c9ae8da69cd3b877e7afaa2c3c23e')
        self.assertEqual(json.loads((root / 'config.json').read_text())['model_sha256'], digest)

    def test_published_sample_matches_previous_deployment(self):
        response = self.client.post('/predict', json=SAMPLE)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertAlmostEqual(result['score'], 0.6528833817519397, places=12)
        self.assertEqual(result['cutoff'], 0.626816175626443)
        self.assertTrue(result['above_cutoff'])
        self.assertTrue(result['research_only'])
        self.assertEqual(result['model_version'], 'india-cbc-logistic-c87ec8485159')

    def test_health_and_openapi(self):
        self.assertEqual(self.client.get('/health').json()['status'], 'ok')
        self.assertIn('/predict', self.client.get('/openapi.json').json()['paths'])

    def test_invalid_inputs_and_identifiers_rejected(self):
        invalid = [{}, dict(SAMPLE, wbc=True), dict(SAMPLE, rbc=0),
                   dict(SAMPLE, neutrophils=99, lymphocytes=99),
                   dict(SAMPLE, patient_id='DO_NOT_ECHO')]
        for values in invalid:
            with self.subTest(values=values):
                response = self.client.post('/predict', json=values)
                self.assertEqual(response.status_code, 422)
                self.assertNotIn('DO_NOT_ECHO', response.text)

    def test_undefined_ratios_use_saved_imputation(self):
        response = self.client.post('/predict', json=dict(SAMPLE, lymphocytes=0, monocytes=0))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['undefined_ratios_imputed'])

    def test_unknown_browser_origin_not_allowed(self):
        response = self.client.options('/predict', headers={
            'Origin': 'https://unconfigured.example', 'Access-Control-Request-Method': 'POST'})
        self.assertNotIn('access-control-allow-origin', response.headers)


if __name__ == '__main__':
    unittest.main()
