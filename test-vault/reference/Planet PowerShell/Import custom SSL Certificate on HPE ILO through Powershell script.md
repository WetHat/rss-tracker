---
author: "Catalin Cristescu"
published: 2023-07-26T18:37:36.000Z
link: https://powershell.ro/import-custom-ssl-certificate-on-hpe-ilo-through-powershell-script/
id: https://powershell.ro/?p=84
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/Uncategorized,rss/VMWare,rss/certificate,rss/cmdlets,rss/hpe_ilo,rss/pkcs7,rss/powercli]
pinned: false
---
> [!abstract] Import custom SSL Certificate on HPE ILO through Powershell script by Catalin Cristescu - 2023-07-26T18:37:36.000Z
> I want to present a PowerShell script created to facilitate the import of custom SSL Certificates on your ILO remote boards. After several days of dedicated work, I am confident that this script will significantly reduce manual efforts and help the certificate import process for your ILO boards. The script was tested on over 50 […]

🔗Read article [online](https://powershell.ro/import-custom-ssl-certificate-on-hpe-ilo-through-powershell-script/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Import custom SSL Certificate on HPE ILO through Powershell script]]
- - -
I want to present a PowerShell script created to facilitate the import of custom SSL Certificates on your ILO remote boards. After several days of dedicated work, I am confident that this script will significantly reduce manual efforts and help the certificate import process for your ILO boards.

The script was **tested** on over **50 ILOs simultaneously**, each with its pkcs7 file certificate. It demonstrated exceptional performance, smoothly importing the certificates for all ILOs directly.

Script Functionality: The functionality of this PowerShell script is straightforward. To get started, simply copy all the pkcs7 files into the “ImportCerts” directory. The script will then take care of the rest:

1. Export .CER Files: For each certificate found in the “ImportCerts” folder, the script will run the OpenSSL executable to export the corresponding .CER file into the “Output” directory.
2. SSL Certificate Import: Taking the content of the .CER file, the script will make use of the PowerCLI cmdlet to establish a secure connection to the ILO using the specified credentials. Afterwards will import the SSL certificate onto the target ILO board.

Once initiated, the script will perform its magic, connecting to each ILO, importing the SSL certificate, and then gracefully disconnecting. That’s all there is to it! With this process, you can import multiple certificates, saving valuable time and effort on manual tasks.

### Script

# Define input and output directories
$ImportDir = "C:\temp\InstallCert\ImportCERTS"
$ExportDir = "C:\temp\InstallCert\Output"

# Get a list of certificates from the import directory
$ImportCerts = Get-ChildItem -Path $ImportDir

# Load HPEiLOCmdlets module
Write-Host "Loading module: HPEiLOCmdlets"
Import-Module -Name "C:\Program Files\WindowsPowerShell\Modules\hpeilocmdlets.4.0.0\HPEiLOCmdlets.psd1"

# Set target ILO username and password
$targetILOUsername = ""
$targetILOPassword = ""

# Generate a date string for log file naming
$dateString = Get-Date -Format "yyyy-MM-dd_hh-mm-ss"

# Loop through each certificate in the import directory
foreach ($certificate in $ImportCerts) {
    $inputPath = $certificate.FullName
    $certName = $certificate.BaseName
    $tempCER = "$ExportDir\$certName" + "_temp.cer"
    $TempCer2 = "$ExportDir\$certName" + "_temp2.cer"
    $outputCER = "$ExportDir\$certName" + ".cer"
    
    # Use openssl to extract the certificate from pkcs7 format
    & "C:\temp\InstallCert\openssl\openssl.exe" pkcs7 -inform PEM -outform PEM -in $inputPath -print_certs -out $tempCER

    # Split the certificate bundle and find the specific certificate
    $certificateBundle = Get-Content $tempCER | Out-String
    $certificates = $certificateBundle -Split "(?<=" + "-----END CERTIFICATE-----" + [System.Environment]::NewLine + [System.Environment]::NewLine + ")"
    $certificate = $certificates | Where-Object { $_ -like "*$certName*" }
    $certificate | Set-Content -Path $TempCer2 -Encoding Ascii

    # Clean up temporary files
    Remove-Item $tempCER

    # Extract the individual certificate content
    $certContent = Get-Content $TempCer2 -Raw
    Remove-Item $TempCer2
    $start = "-----BEGIN CERTIFICATE-----"
    $end = "-----END CERTIFICATE-----"
    $startIndex = $certContent.IndexOf($start)
    $endIndex = $certContent.IndexOf($end, $startIndex + $start.Length)
    $cert = $certContent.Substring($startIndex + $start.Length, $endIndex - $startIndex - $start.Length)
    $certVariable = "-----BEGIN CERTIFICATE-----$cert-----END CERTIFICATE-----"
    $certVariable | Set-Content -Path $outputCER -Encoding Ascii

    # Connect to the target ILO using HPEiLOCmdlets and import the certificate
    Write-Host "`nConnecting using Connect-HPEiLO`n" -ForegroundColor Green
    $connect = Connect-HPEiLO -IP $certName -Username $targetILOUsername -Password $targetILOPassword -DisableCertificateAuthentication
    Import-HPEiLOCertificate -Connection $connect -Certificate $certVariable

    # Disconnect from ILO
    if ($connect -ne $null) {
        Write-Host "Disconnect using Disconnect-HPEiLO`n" -ForegroundColor Yellow
        $disconnect = Disconnect-HPEiLO -Connection $connect
        $disconnect | Format-List
        Write-Host "Connection disconnected successfully.`n"
    }
}

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
