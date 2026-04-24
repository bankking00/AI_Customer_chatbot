# setup_backend.ps1

cd "d:\customer support ai"

# Create Backend Root & Enter
mkdir backend
cd backend

# Initialize Virtual Environment using uv with Python 3.8.10
uv venv --python 3.8.10 .venv

# Create Directory Structure
mkdir api, agent, rag, tools, data

# Create Empty Data Files
New-Item -Path data/orders.json -ItemType File
New-Item -Path data/tickets.json -ItemType File
New-Item -Path data/faq.txt -ItemType File
New-Item -Path data/return_policy.txt -ItemType File

# Create Empty Source Files
New-Item -Path rag/retriever.py -ItemType File
New-Item -Path tools/orders.py -ItemType File
New-Item -Path tools/tickets.py -ItemType File
New-Item -Path agent/orchestrator.py -ItemType File
New-Item -Path api/main.py -ItemType File
New-Item -Path main.py -ItemType File
New-Item -Path requirements.txt -ItemType File
New-Item -Path .env -ItemType File

Write-Host "Backend environment structure generated successfully!"
