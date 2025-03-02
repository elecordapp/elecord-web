# script to build the webapp locally on windows

# check if the 'webapp' folder exists and remove it
$webappPath = "$(Get-Location)\webapp"
if (Test-Path $webappPath) {
    Remove-Item -Recurse -Force $webappPath
    Write-Host "Deleted existing webapp folder." -ForegroundColor Cyan
}

# install dependencies using Yarn
yarn install
Write-Host "Yarn install completed." -ForegroundColor Cyan

# build the app
yarn build
# copy LATEST.md to webapp
Copy-Item -Path "$(Get-Location)\LATEST.md" -Destination "$(Get-Location)\webapp\LATEST.md"
Write-Host "Yarn build completed." -ForegroundColor Cyan

# start a Python HTTP server to serve webapp/index.html
$pythonCommand = "python -m http.server 8000 --directory webapp"
Write-Host "Running Python HTTP server..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-Command $pythonCommand"
