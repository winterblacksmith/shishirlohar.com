FROM python:3.12-alpine AS assemble
RUN apk add --no-cache git
WORKDIR /site
COPY dist/ dist/
COPY scripts/ scripts/
COPY atlas-quant.lock.json atlas-quant.lock.json
RUN python3 scripts/assemble-atlas.py --fetch && python3 scripts/version-assets.py && python3 scripts/check.py

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=assemble /site/dist/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
