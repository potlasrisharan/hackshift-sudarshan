FROM python:3.11-slim
WORKDIR /original
COPY hackshift/projects/project-2/backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY hackshift/projects/project-2/backend ./backend
EXPOSE 8000
CMD ["uvicorn","backend.app.main:app","--host","0.0.0.0","--port","8000"]
