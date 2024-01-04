# Install Python dependencies
pip install setuptools wheel
pip install -r requirements.txt
Write-Host "Python dependencies installed successfully."

pip install --upgrade Pillow
Write-Host "Pillow installed successfully."

# Navigate to Frontend directory
cd Frontend

# Install npm dependencies
npm install
Write-Host "npm dependencies installed successfully."

# Build React app
npm run build
Write-Host "React app build completed."

Write-Host "Setup completed successfully."
