import os
import re

# 定義要替換的佔位符與對應的環境變數名稱
# 格式: { "佔位符": "環境變數名稱" }
REPLACEMENTS = {
    "__FIREBASE_API_KEY__": "VITE_FIREBASE_API_KEY",
    "__FIREBASE_AUTH_DOMAIN__": "VITE_FIREBASE_AUTH_DOMAIN",
    "__FIREBASE_PROJECT_ID__": "VITE_FIREBASE_PROJECT_ID",
    "__FIREBASE_STORAGE_BUCKET__": "VITE_FIREBASE_STORAGE_BUCKET",
    "__FIREBASE_MESSAGING_SENDER_ID__": "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "__FIREBASE_APP_ID__": "VITE_FIREBASE_APP_ID",
}

def inject_secrets(directory):
    print(f"🚀 開始在 {directory} 中注入 Secrets...")
    
    # 遍歷目錄下的所有檔案
    for root, dirs, files in os.walk(directory):
        for filename in files:
            # 僅處理 HTML, JS, JSON 檔案
            if filename.endswith(('.html', '.js', '.json')):
                filepath = os.path.join(root, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    modified = False
                    
                    for placeholder, env_var in REPLACEMENTS.items():
                        if placeholder in content:
                            secret_value = os.environ.get(env_var)
                            if secret_value:
                                print(f"✅ 檔案 {filename}: 替換 {placeholder}")
                                new_content = new_content.replace(placeholder, secret_value)
                                modified = True
                            else:
                                print(f"⚠️ 警告: 找不到環境變數 {env_var} 用於替換 {placeholder}")
                    
                    if modified:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                            
                except Exception as e:
                    print(f"❌ 處理檔案 {filename} 時發生錯誤: {e}")

if __name__ == "__main__":
    # 預設處理 dist 目錄
    target_dir = os.path.join(os.getcwd(), 'dist')
    if os.path.exists(target_dir):
        inject_secrets(target_dir)
        print("✨ 注入完成！")
    else:
        print(f"❌ 找不到目標目錄: {target_dir}")
