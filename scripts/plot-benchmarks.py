"""Generate charts only from the committed measured benchmark JSON."""
import json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
r=json.loads(Path('docs/benchmarks/results.json').read_text())
fig,axes=plt.subplots(1,2,figsize=(10,4),layout='constrained')
axes[0].bar(['Dhaaga','Cheapest-only baseline'],[r['allocation']['oursUnsafe'],r['allocation']['baselineUnsafe']],color=['#397e70','#b67c51'])
axes[0].set_ylabel('Unsafe stock selections / 500 constructed cases')
axes[0].set_title('Synthetic allocation constraints')
labels=[x['algorithm'] for x in r['latency']]
axes[1].barh(labels,[x['meanMs'] for x in r['latency']],color='#397e70')
axes[1].set_xlabel('Measured mean milliseconds / call')
axes[1].set_title('Local runtime; 1,000 iterations')
fig.suptitle(f"Synthetic mechanism demonstration • seed {r['seed']}\nNot clinical validation or real-world superiority",fontsize=11)
fig.savefig('docs/benchmarks/measured-results.png',dpi=160)
