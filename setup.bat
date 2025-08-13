@echo off
echo 🚀 Setting up Leave Management System...

REM Check if UV is installed
uv --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing UV package manager...
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    if %errorlevel% neq 0 (
        echo ❌ Failed to install UV. Please install manually from https://docs.astral.sh/uv/
        pause
        exit /b 1
    )
)

echo 📁 Creating virtual environment...
uv venv

echo 🔧 Activating virtual environment...
call .venv\Scripts\activate

echo 📥 Installing dependencies...
uv pip install -e .
uv pip install -e ".[dev]"

echo 🗄️ Setting up database...
python -c "from app.database import create_tables; create_tables(); print('✅ Database tables created successfully!')"

echo 🧪 Running tests to verify setup...
pytest -v

echo ✅ Setup complete!
echo.
echo 🏃‍♂️ To start the development server:
echo    python run_dev.py
echo.
echo 📚 API Documentation will be available at:
echo    http://localhost:8000/docs
echo.
echo 🔍 Health check endpoint:
echo    http://localhost:8000/health
echo.
pause
