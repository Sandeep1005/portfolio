FROM python:3.10-slim

WORKDIR /app

COPY backend/ /app/

RUN python3 -m venv /app/venv
RUN /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r requirements.txt

RUN chmod +x /app/run_server.sh

ENV PATH="/app/venv/bin:$PATH"

CMD ["bash", "/app/run_server.sh"]
