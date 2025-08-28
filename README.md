# gemini-summarizer-extension
A browser extension to summarize any webpage and enable a Q&amp;A chat about the content, powered by the Google Gemini API. Features a secure "Bring Your Own Key" model and a sidebar interface. Built with vanilla JavaScript for Chrome's Manifest V3.
⚙️ Getting Started
Follow these steps to set up and run the extension locally.
Step 1: Create Your Google AI API Key
This extension requires your own personal API key to communicate with Google's Gemini model.
1. Navigate to Google AI Studio
  -Go to aistudio.google.com and sign in with your Google account.
2. Generate the API Key
  -On the left-hand menu, click "Get API key".
  -Click on "Create API key in new project".
  -A new API key will be generated. Copy this key and save it somewhere safe for the next steps.
3. Important: Enable Billing to Activate the API
  -The Gemini API has a generous free tier, but to prevent abuse, Google requires you to enable a billing account on the project. You will not be charged as long as you stay within the free limits.
  -Go to the Google Cloud Console Billing Page.
  -At the top, select the project that was just created (it is likely named "My First Project" or "Generative Language Client").
  -Follow the on-screen instructions to "Link a billing account". You will need to create a billing account if you don't have one, which requires a payment method.
  -After linking, it may take a few minutes for the API key to become fully active.
Step 2: Install and Configure the Extension
1. Download the Code
If you have Git, clone this repository. Otherwise, download the project as a ZIP file.
  git clone https://github.com/your_username/your_repository_name.git
2. Load the Extension in Chrome
  -Open your Chrome browser and navigate to chrome://extensions.
  -Turn on "Developer mode" using the toggle in the top right corner.
  -Click the "Load unpacked" button.
  -Select the entire project folder you downloaded. The extension icon will now appear in your toolbar.
3. Add Your API Key
   -Right-click the extension's icon in your toolbar and select "Options".
  -A new tab will open with the settings page.
  -Paste your Google AI API key (from Step 1) into the input box.
  -Click "Save API Key".
