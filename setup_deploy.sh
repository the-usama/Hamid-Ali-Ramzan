#!/bin/bash

echo "🚀 Starting Deployment Setup for 'Hamid Ali Legacy'..."

# 1. Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    echo "⚠️  Please follow any 'Next steps' shown in the terminal above to add brew to your PATH."
    echo "   (Usually requires running two commands starting with 'echo' and 'eval')"
    echo "   After doing that, run this script again."
    exit 1
else
    echo "✅ Homebrew found."
fi

# 2. Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "📦 GitHub CLI (gh) not found. Installing..."
    brew install gh
else
    echo "✅ GitHub CLI found."
fi

# 3. Authenticate
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "⚠️  You are not logged in to GitHub."
    echo "   Running 'gh auth login' now. Follow the prompts!"
    gh auth login
fi

# 4. Create Repo and Push
echo "🌐 Creating GitHub Repository 'Hamid Ali Legacy'..."
if gh repo create "Hamid Ali Legacy" --public --source=. --remote=origin --push; then
    echo "🎉 SUCCESS! Website deployed to GitHub."
    echo "👉 Repository URL: $(gh repo view --json url -q .url)"
    
    # Configure Pages (Optional, requires gh pages support or manual setup, usually just pushing main is enough if valid)
    echo "ℹ️  To view your site live, go to Settings > Pages in your repo and select the 'main' branch."
else
    echo "❌ Failed to create/push repository. It might already exist."
fi
