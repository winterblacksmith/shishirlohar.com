# Deploy to shishirlohar.com

## Current server deployment

The portfolio is installed on Casterly Rock (`opc@129.80.109.207`, Oracle Linux 9) using its existing Nginx service. This VM has about 1 GB RAM, so Dokploy was deferred with the owner's approval. No Docker installation or VM resize was performed.

- Repository: https://github.com/winterblacksmith/shishirlohar.com (private, branch `main`).
- Releases: `/var/www/shishirlohar.com/releases/`; active symlink: `/var/www/shishirlohar.com/current`.
- Nginx virtual host: `/etc/nginx/conf.d/shishirlohar.com.conf`. The original default configuration remains intact.
- Server-local checks passed for the homepage, projects, experience, JavaScript, PDF, and 404 handling.
- OCI network security group ingress allows public TCP traffic only on ports 80 and 443 for this site. The VM firewall also allows HTTP and HTTPS.
- Let's Encrypt provides HTTPS for `shishirlohar.com`; Certbot manages renewal. HTTP redirects permanently to HTTPS.

For future content updates, commit and push, then run `bash scripts/deploy-nginx.sh`. It uploads only tracked website files, retains prior releases, and atomically changes the active symlink. It uses your local SSH access and requires no GitHub token on the server.

### Automatic deployment from GitHub

`.github/workflows/deploy.yml` validates and deploys the tracked `dist/` directory after every push to `main`. It can also be run manually from the repository's Actions tab. The workflow uses a dedicated deployment SSH key and the following GitHub Actions secrets:

- `DEPLOY_HOST`: `129.80.109.207`
- `DEPLOY_USER`: `opc`
- `DEPLOY_SSH_KEY`: the private half of a dedicated deployment key

Do not upload the laptop's personal SSH key. Generate a separate Ed25519 key without a passphrase for this one repository, append its public half to `/home/opc/.ssh/authorized_keys`, and save only its private half as `DEPLOY_SSH_KEY`. The server account already restricts deployment changes through `sudo`; keep the repository private and rotate the key if repository access changes.

Until these three secrets and the dedicated public key are installed, pushes remain safe: the workflow fails before connecting and the current production release keeps running. Once configured, the deployment flow is:

`push to main → validate → upload versioned release → atomically switch current symlink → verify HTTPS`

Rollback by pointing `current` at a previous release directory. Nginx reads through that symlink, so content changes do not require a restart.

The Docker/Dokploy setup below is retained for a future larger server.

## Architecture

Browser → HTTPS / Dokploy Traefik → portfolio Nginx container, port 80.

Deploy this same repository on your existing server or on an Oracle Cloud VM running Dokploy. You can run both, but choose one as the production origin for shishirlohar.com. Two ordinary DNS A records are not automatic failover. Give the second installation a separate staging hostname if desired.

## Dokploy on an existing server

1. Push this project to a Git repository you control.
2. In Dokploy, create a project and Application, connect the repository, and select your deployment branch.
3. Select Dockerfile as the build type, Dockerfile path `Dockerfile`, and context `.`. No environment variables or build commands are needed.
4. Deploy. The container serves port **80**; `/health` returns `ok`.
5. Add domain `shishirlohar.com`, path `/`, container port `80`, HTTPS enabled with Let's Encrypt.
6. At your DNS provider, point the apex (`@`) A record to this server's public IPv4 address. Add `www` as a CNAME to `shishirlohar.com` if wanted, and configure that hostname in Dokploy too. Remove stale AAAA records unless IPv6 is configured on this server.
7. Verify HTTPS, the résumé download, `/projects/`, `/experience/`, and an unknown URL returning 404. Check Dokploy health and logs.

Alternative: create a Dokploy Docker Compose service using `compose.yaml`. Choose service `portfolio` and port `80` in its Domains tab, then redeploy after domain changes. Do not expose host port 80 from this Compose file; Traefik owns host ports 80/443.

## Oracle Cloud Always Free

As checked September 19, 2026, Oracle's primary documentation lists **1,500 OCPU-hours and 9,000 GB-hours per month**, equivalent to **2 OCPUs and 12 GB RAM** across Ampere A1 instances, plus **200 GB combined boot/block storage**. Check the Always Free eligibility shown in your own tenancy before creating resources; existing usage counts toward the totals.

1. In your tenancy's home region, create an Always Free eligible `VM.Standard.A1.Flex` Ubuntu 24.04 ARM VM. A practical allocation is 1 OCPU, 6 GB memory, and a 50 GB boot volume, within your remaining free allowance. Dokploy documents a minimum of 2 GB RAM and 30 GB disk. The 1 GB AMD Micro is below that RAM minimum.
2. Use a public subnet with an Internet Gateway/default route and a public IPv4 address. Keep SSH key access available.
3. Configure both OCI network security rules and the VM firewall: public TCP 80 and 443 for the site; restrict SSH 22 and initial Dokploy access 3000 to your own IP. Do not disable the VM firewall wholesale.
4. SSH into the VM and install Dokploy using the current official instructions. The documented installer is `curl -sSL https://dokploy.com/install.sh | sh`, run as root on the Linux server. Inspect the script before execution. This has not been run by this project.
5. Complete the Dokploy admin setup through your restricted access route, then follow the Application steps above. Configure a dedicated HTTPS admin hostname if desired.
6. Use the VM's public address for your domain DNS. Keep the address stable across VM lifecycle changes.

The Dockerfile uses the official multi-architecture `nginx:stable-alpine` image and has no architecture-specific application binaries. Build natively on the target host. This project does not create paid cloud resources, databases, or load balancers.

Oracle notes that free compute capacity may be unavailable and idle Always Free VMs may be reclaimed. Keep the source repository backed up and understand that free tier is not an uptime guarantee. No cloud account changes or charges have been made.

## Local Docker smoke test

```sh
docker build -t shishir-portfolio .
docker run --rm -p 127.0.0.1:8080:80 shishir-portfolio
```

In another terminal:

```sh
curl -f http://127.0.0.1:8080/health
curl -I http://127.0.0.1:8080/projects/
curl -I http://127.0.0.1:8080/assets/shishir-lohar-resume.pdf
curl -I http://127.0.0.1:8080/does-not-exist
```

The final command should return 404. Production HTTPS is terminated by Dokploy, not this local container.

## Moving from GitHub Pages

Keep the old site live until the new origin passes checks. This site's canonical URLs already use shishirlohar.com. Once DNS has switched and HTTPS works, you can update the old GitHub Pages site to link or redirect visitors to the new domain. This project does not modify the old repository or its custom-domain settings.

## Official references

- [Dokploy installation](https://docs.dokploy.com/docs/core/installation)
- [Dokploy application domains](https://docs.dokploy.com/docs/core/domains)
- [Dokploy Compose domains](https://docs.dokploy.com/docs/core/docker-compose/domains)
- [Oracle Always Free resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
