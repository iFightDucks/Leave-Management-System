#!/bin/bash

echo "🚀 Setting up Leave Management System..."

# Check if UV is installed
if ! command -v uv &> /dev/null; then
    echo "📦 Installing UV package manager..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    else
        curl -LsSf https://astral.sh/uv/install.sh | sh
    fi
    
    # Reload shell to get uv in PATH
    source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
fi

echo "📁 Creating virtual environment..."
uv venv

echo "🔧 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source .venv/Scripts/activate
else
    source .venv/bin/activate
fi

echo "📥 Installing dependencies..."
uv pip install -e .
uv pip install -e ".[dev]"

echo "🗄️  Setting up database..."
python -c "
from app.database import create_tables
create_tables()
print('✅ Database tables created successfully!')
"

echo "🧪 Running tests to verify setup..."
pytest -v

echo "✅ Setup complete!"
echo ""
echo "🏃‍♂️ To start the development server:"
echo "   python run_dev.py"
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://localhost:8000/docs"
echo ""
echo "🔍 Health check endpoint:"
echo "   http://localhost:8000/health"
