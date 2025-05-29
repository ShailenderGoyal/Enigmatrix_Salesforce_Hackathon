EnigMatrix Colab Notebook
This Google Colab notebook sets up a ready-to-use environment for deploying a lightweight Retrieval-Augmented Generation (RAG) system using:

LangChain

HuggingFace Embeddings

FAISS for vector storage

Google Generative AI

FastAPI with ngrok tunnel

🔧 Features
GPU-enabled environment setup for PyTorch with CUDA.

LangChain integration for modular language model workflows.

Embeddings + FAISS Vector Search: Quickly index and retrieve relevant documents.

FastAPI server exposed via ngrok for external access.

Google Generative AI support (via Gemini API).

Suitable for small-scale experiments and testing RAG pipelines in a hosted notebook environment.

🚀 Getting Started
Run All Cells to install dependencies and set up the runtime.

Provide your ngrok token in the NGROK_AUTH_TOKEN variable.

Restart the runtime when prompted to finalize environment changes.

The FastAPI server will be launched and made publicly accessible via the ngrok URL.

📦 Key Dependencies
torch, torchvision, torchaudio (CUDA 11.8 compatible)

transformers==4.35.2

sentence-transformers==2.3.1

faiss-cpu==1.7.4

langchain==0.0.350

langchain-community==0.0.13

fastapi, uvicorn

pyngrok

google-generativeai

🌐 Public API via ngrok
This notebook uses pyngrok to tunnel the FastAPI server. This enables you to test APIs externally without any manual server hosting or port forwarding.

📄 Notes
Ensure you replace the NGROK_AUTH_TOKEN with your actual token for tunneling.

You can adapt the backend logic to support your own document loaders, embedding models, or endpoints.
