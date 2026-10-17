"""Synthetic local Cognee proof. No external inference or real health data.

Python 3.11; install requirements.lock.txt into an isolated virtual environment.
Run with an explicit private working directory and cached local model assets.
This runner is intentionally separate from the public demo API.
"""
import asyncio
import ipaddress
import json
import os
from pathlib import Path
import socket
import tempfile
import time

ROOT = Path(os.environ.get('PRIVACY_NODE_DATA_DIR') or tempfile.mkdtemp(prefix='dhaaga-private-')).resolve()
ROOT.mkdir(mode=0o700,parents=True,exist_ok=True)
# Set BEFORE importing Cognee so defaults cannot select a cloud inference backend.
for key,value in {
 'TELEMETRY_DISABLED':'true','ENABLE_BACKEND_ACCESS_CONTROL':'false','CACHING':'false',
 'LLM_PROVIDER':'ollama','LLM_MODEL':os.environ.get('LOCAL_LLM_MODEL','aya-expanse:8b'),
 'LLM_ENDPOINT':'http://127.0.0.1:11434','LLM_API_KEY':'ollama','LLM_TEMPERATURE':'0.0',
 'EMBEDDING_PROVIDER':'ollama','EMBEDDING_MODEL':'nomic-embed-text:latest',
 'EMBEDDING_ENDPOINT':'http://127.0.0.1:11434/api/embed','EMBEDDING_DIMENSIONS':'768',
 'HUGGINGFACE_TOKENIZER':'nomic-ai/nomic-embed-text-v1.5','HF_HUB_OFFLINE':'1',
 'HF_HOME':os.environ.get('DHAAGA_MODEL_CACHE','/tmp/dhaaga-model-cache')+'/hf',
 'TIKTOKEN_CACHE_DIR':os.environ.get('DHAAGA_MODEL_CACHE','/tmp/dhaaga-model-cache')+'/tiktoken',
 'GRAPH_DATABASE_PROVIDER':'ladybug','GRAPH_DATASET_DATABASE_HANDLER':'ladybug',
 'VECTOR_DB_PROVIDER':'lancedb','DB_PROVIDER':'sqlite',
 'GRAPH_DATABASE_SUBPROCESS_ENABLED':'false',
 'KUZU_BUFFER_POOL_SIZE':'134217728','KUZU_MAX_DB_SIZE':'1073741824',
}.items(): os.environ[key]=value

# Python-level defense in depth. This does not constrain native subprocesses or
# prove zero system-wide egress; OS/container networking is needed for that.
blocked=[]
original_connect=socket.socket.connect
original_connect_ex=socket.socket.connect_ex

def check_address(address):
    if isinstance(address,str): return # Unix-domain sockets
    host=address[0]
    if host=='localhost': return
    try: allowed=ipaddress.ip_address(host).is_loopback
    except ValueError: allowed=False
    if not allowed:
        blocked.append(str(host))
        raise PermissionError('Privacy Node blocks non-loopback Python socket connection')

def guarded_connect(sock,address):
    check_address(address)
    return original_connect(sock,address)

def guarded_connect_ex(sock,address):
    check_address(address)
    return original_connect_ex(sock,address)

async def main():
    import cognee
    from cognee.modules.search.types import SearchType
    cognee.config.data_root_directory(str(ROOT/'data'))
    cognee.config.system_root_directory(str(ROOT/'system'))
    cognee.config.set_graph_database_provider('ladybug')
    cognee.config.set_vector_db_provider('lancedb')
    if os.environ.get('PRIVACY_NODE_ENFORCE_EGRESS','true')=='true':
        socket.socket.connect=guarded_connect
        socket.socket.connect_ex=guarded_connect_ex
    began=time.perf_counter()
    # MOCK: synthetic record for reproducible local graph extraction.
    text='Sunita is a synthetic demo patient. Her clinic recorded systolic blood pressure of 124 mmHg. Her intake recorded systolic blood pressure of 128 mmHg. Both observations belong to the same synthetic record. No diagnosis is made.'
    await cognee.remember(text,dataset_name='dhaaga_synthetic',self_improvement=False)
    results=await cognee.recall(query_text='Which systolic blood pressure readings were recorded for Sunita?',query_type=SearchType.GRAPH_COMPLETION,datasets=['dhaaga_synthetic'])
    report={'synthetic':True,'cognee':'1.6.5','storage':str(ROOT),'graph':'ladybug','vectors':'lancedb','metadata':'sqlite','llm':os.environ['LLM_MODEL'],'embedding':'nomic-embed-text:latest','elapsedSeconds':round(time.perf_counter()-began,3),'blockedPythonConnections':len(blocked),'networkProof':'Python socket guard only; not system-wide egress proof','recall':[str(getattr(r,'text',r)) for r in results]}
    (ROOT/'verification.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))

if __name__=='__main__': asyncio.run(main())
