---
role: rssitem
aliases:
  - Using WSL and Let's Encrypt to create Azure App Service SSL Wildcard Certificates
id: https://www.hanselman.com/blog/post/7fbeba21-edbe-4af4-b909-26b6ba644546
author: Scott Hanselman
link: https://feeds.hanselman.com/~/749206136/0/scotthanselman~Using-WSL-and-Lets-Encrypt-to-create-Azure-App-Service-SSL-Wildcard-Certificates
published: 2023-06-27T17:17:25.000Z
feed: "[[Scott Hanselman's Blog]]"
pinned: false
tags:
  - rss/Azure
---

> [!abstract] Using WSL and Let's Encrypt to create Azure App Service SSL Wildcard Certificates (by Scott Hanselman)
> ![image|float:right|400](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/Using-WSL-and-Lets-Encrypt-to-create-Azu_C384/image_3849c466-fcdb-4abd-96ad-8d52a5e93730.png "Custom Domains in Azure App Service") There are many let's encrypt automatic tools for azure but I also wanted to see if I could use certbot in wsl to generate a wildcard certificate for the azure Friday website and then upload the resulting certificates to azure app service.
> 
> Azure app service ultimately needs a specific format called dot PFX that includes the full certificate path and all intermediates.
> 
> Per the docs, App Service private certificates must meet [the following requirements](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex%2Cportal#private-certificate-requirements):
> 
> - Exported as a password-protected PFX file, encrypted using triple DES.
> - Contains private key at least 2048 bits long
> - Contains all intermediate certificates and the root certificate in the certificate chai⋯

🌐 Read article [online](https://feeds.hanselman.com/~/749206136/0/scotthanselman~Using-WSL-and-Lets-Encrypt-to-create-Azure-App-Service-SSL-Wildcard-Certificates). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[RSS/Feeds/Scott Hanselman's Blog/Using WSL and Let's Encrypt to create Azure App Service SSL Wildcard Certificate⋯|Using WSL and Let's Encrypt to create Azure App Service SSL Wildcard Certificate⋯]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

There are many let's encrypt automatic tools for azure but I also wanted to see if I could use certbot in wsl to generate a wildcard certificate for the azure Friday website and then upload the resulting certificates to azure app service.

Azure app service ultimately needs a specific format called dot PFX that includes the full certificate path and all intermediates.

Per the docs, App Service private certificates must meet [the following requirements](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex%2Cportal#private-certificate-requirements):

- Exported as a password-protected PFX file, encrypted using triple DES.
- Contains private key at least 2048 bits long
- Contains all intermediate certificates and the root certificate in the certificate chain.

If you have a PFX that doesn't meet all these requirements you can have Windows reencrypt the file.

I use WSL and certbot to create the cert, then I import/export in Windows and upload the resulting PFX.

Within WSL, install certbot:

```undefined
sudo apt update
sudo apt install python3 python3-venv libaugeas0
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot
```

Then I generate the cert. You'll get a nice text UI from certbot and update your DNS as a verification challenge. Change this to make sure it's **two** lines, and your domains and subdomains are correct and your paths are correct.

```undefined
sudo certbot certonly --manual --preferred-challenges=dns --email YOUR@EMAIL.COM   
    --server https://acme-v02.api.letsencrypt.org/directory   
    --agree-tos   --manual-public-ip-logging-ok   -d "azurefriday.com"   -d "*.azurefriday.com"
sudo openssl pkcs12 -export -out AzureFriday2023.pfx 
    -inkey /etc/letsencrypt/live/azurefriday.com/privkey.pem 
    -in /etc/letsencrypt/live/azurefriday.com/fullchain.pem
```

I then copy the resulting file to my desktop (check your desktop path) so it's now in the Windows world.

```undefined
sudo cp AzureFriday2023.pfx /mnt/c/Users/Scott/OneDrive/Desktop
```

Now from Windows, import the PFX, note the thumbprint and export that cert.

```undefined
Import-PfxCertificate -FilePath "AzureFriday2023.pfx" -CertStoreLocation Cert:\LocalMachine\My 
    -Password (ConvertTo-SecureString -String 'PASSWORDHERE' -AsPlainText -Force) -Exportable
Export-PfxCertificate -Cert Microsoft.PowerShell.Security\Certificate::LocalMachine\My\597THISISTHETHUMBNAILCF1157B8CEBB7CA1 
    -FilePath 'AzureFriday2023-fixed.pfx' -Password (ConvertTo-SecureString -String 'PASSWORDHERE' -AsPlainText -Force)
```

Then upload the cert to the Certificates section of your App Service, under Bring Your Own Cert.

![Custom Domains in Azure App Service](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/Using-WSL-and-Lets-Encrypt-to-create-Azu_C384/image_3849c466-fcdb-4abd-96ad-8d52a5e93730.png "Custom Domains in Azure App Service")

Then under Custom Domains, click Update Binding and select the new cert (with the latest expiration date).

![image](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/Using-WSL-and-Lets-Encrypt-to-create-Azu_C384/image_3d6c1eb8-4a3e-4004-985a-75e8f8f56118.png "image")

Next step is to make this even more automatic or select a more automated solution but for now, I'll worry about this in September and it solved my expensive Wildcard Domain issue.

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/749206136/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/749206136/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/749206136/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/749206136/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/749206136/scotthanselman "Subscribe by RSS")