import os

def test_frontend_branding():
    """
    Verify that the frontend branding is set to 'Lovable'.
    """
    index_html_path = os.path.join(os.getcwd(), "..", "frontend", "index.html")
    assert os.path.exists(index_html_path), "frontend/index.html not found"
    
    with open(index_html_path, "r") as f:
        content = f.read()
        
    # Check for Lovable branding
    assert "Lovable App" in content
    assert "Lovable" in content
    
    # Ensure no traces of VictorGenius remain
    assert "VictorGenius" not in content

def test_backend_branding_info():
    """
    Check if backend knows about the branding.
    """
    from app.main import app
    assert app.title == "Snake Spectacle Game"
