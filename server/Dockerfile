FROM python:3
WORKDIR /app
COPY . .
RUN python -m venv venv
RUN ./venv/bin/pip install -r requirements.txt
EXPOSE 5000
CMD ./devrun.sh
