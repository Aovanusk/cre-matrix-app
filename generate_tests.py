import random
import string
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch

def get_random_text(length):
    return ''.join(random.choices(string.ascii_letters + " ", k=length))

def create_test_1_menu(filename):
    # Test 1: Restaurant Menu (No CRE data)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 30)
    c.drawString(width/2 - 150, height - 100, "LUIGI'S PIZZERIA MENU")
    
    c.setFont("Helvetica", 14)
    c.drawString(100, height - 200, "Margherita Pizza .................... $15.00")
    c.drawString(100, height - 230, "Pepperoni Pizza ..................... $18.00")
    c.drawString(100, height - 260, "Pasta Carbonara ..................... $22.00")
    c.drawString(100, height - 290, "Tiramisu ............................ $8.00")
    
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(100, 100, "All prices include tax. Thank you for dining with us!")
    
    c.save()

def create_test_2_proforma(filename):
    # Test 2: Current vs Pro Forma
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "OFFERING MEMORANDUM: 777 OAK STREET")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 120, "We are pleased to present the exclusive listing for 777 Oak Street.")
    c.drawString(50, height - 140, "The asking price is firmly set at $10,500,000.")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 200, "CURRENT FINANCIALS (AS-IS, 2024)")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 220, "Current NOI: $420,000")
    c.drawString(50, height - 240, "Current Cap Rate: 4.00%")
    c.drawString(50, height - 260, "Occupancy: 65%")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 320, "PRO FORMA FINANCIALS (YEAR 1 STABILIZED)")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 340, "Pro Forma NOI: $787,500")
    c.drawString(50, height - 360, "Pro Forma Cap Rate: 7.50%")
    c.drawString(50, height - 380, "Stabilized Occupancy: 95%")
    
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, 100, "Note: Investors should base their underwriting on the 7.5% Pro Forma metric.")
    
    c.save()

def create_test_3_portfolio(filename):
    # Test 3: Portfolio Sale (Multiple properties)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "TEXAS MULTIFAMILY PORTFOLIO (3 PROPERTIES)")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 100, "Total Portfolio Asking Price: $25,000,000")
    c.drawString(50, height - 120, "Total Portfolio NOI: $1,500,000")
    c.drawString(50, height - 140, "Blended Cap Rate: 6.00%")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 200, "Asset 1: Austin Heights")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 220, "Price: $10,000,000 | NOI: $550,000 | Cap Rate: 5.5% | GLA: 40,000 SF")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 260, "Asset 2: Dallas Lofts")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 280, "Price: $8,000,000 | NOI: $520,000 | Cap Rate: 6.5% | GLA: 35,000 SF")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 320, "Asset 3: Houston Towers")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 340, "Price: $7,000,000 | NOI: $430,000 | Cap Rate: 6.14% | GLA: 28,000 SF")
    
    c.save()

def create_test_4_scan(filename):
    # Test 4: Simulated "Bad Scan"
    # We'll use a very weird font, angled text, and lots of noise dots/lines
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Add dirt / noise
    c.setFillColor(HexColor("#cccccc"))
    for _ in range(3000):
        x = random.randint(0, int(width))
        y = random.randint(0, int(height))
        c.circle(x, y, random.random() * 2, stroke=0, fill=1)
        
    c.setFillColor(HexColor("#333333"))
    c.setFont("Courier-Bold", 14)
    
    # Rotate the whole canvas slightly to simulate a crooked scan
    c.translate(50, 50)
    c.rotate(3)
    
    c.drawString(0, height - 150, "F A X   T R A N S M I S S I O N   1 9 9 8")
    c.drawString(0, height - 200, "PROPERTY: 555 RUSTY ROAD")
    c.drawString(0, height - 230, "ASKING PRICE...... $ 1, 2 0 0, 0 0 0")
    
    # Make it blurry/messy by drawing it twice slightly offset
    c.setFillColor(HexColor("#666666"))
    c.drawString(1, height - 230.5, "ASKING PRICE...... $ 1, 2 0 0, 0 0 0")
    
    c.setFillColor(HexColor("#333333"))
    c.drawString(0, height - 280, "N.O.I. ........... $ 8 4, 0 0 0")
    c.drawString(0, height - 330, "CAP RATE ......... 7 . 0 %")
    c.drawString(0, height - 380, "SQUARE FEET ...... 5 , 5 0 0   S Q   F T")
    
    c.save()

def create_test_5_timeout(filename):
    # Test 5: 50-page dense PDF to test Timeout (100 might be too big for quick generation, 50 is enough to stress test Vercel)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    for page in range(50):
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, height - 50, f"ANNUAL CORPORATE REPORT - PAGE {page + 1}")
        
        c.setFont("Helvetica", 8)
        y = height - 80
        for _ in range(40):
            # Write a dense line of text
            c.drawString(50, y, get_random_text(150))
            y -= 15
            
        if page == 42:
            # Hide the actual real estate data deep on page 43 (index 42)
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, 200, "ACQUISITION TARGET: 999 HIDDEN GEM BLVD")
            c.drawString(50, 180, "Purchase Price: $22,500,000")
            c.drawString(50, 160, "Net Operating Income: $1,462,500")
            c.drawString(50, 140, "Capitalization Rate: 6.50%")
            c.drawString(50, 120, "Total GLA: 120,000 SF")
            
        c.showPage()
        
    c.save()

if __name__ == "__main__":
    create_test_1_menu("test_1_menu.pdf")
    create_test_2_proforma("test_2_proforma.pdf")
    create_test_3_portfolio("test_3_portfolio.pdf")
    create_test_4_scan("test_4_scan.pdf")
    create_test_5_timeout("test_5_timeout.pdf")
    print("All 5 test PDFs generated successfully!")
