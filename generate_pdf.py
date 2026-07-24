import random
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

def create_messy_pdf(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Page 1: Confusing cover with watermark
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(HexColor("#eeeeee"))
    c.translate(width/2, height/2)
    c.rotate(45)
    c.drawString(-200, 0, "DRAFT - DO NOT DISTRIBUTE")
    c.rotate(-45)
    c.translate(-width/2, -height/2)
    
    c.setFillColor(HexColor("#000000"))
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 100, "INVESTMENT OPPORTUNITY")
    
    # Hide the price in a massive block of text, using a weird synonym
    c.setFont("Helvetica", 10)
    c.drawString(50, 400, "The ownership group is currently seeking offers. While unpriced, guidance for the Transfer Value is estimated to be approximately Four Million, Two Hundred")
    c.drawString(50, 390, "and Fifty Thousand Dollars ($4,250,000). The Net Cash Flow (pre-tax) achieved last year was 310K, though projected stabilized Yield on Cost metric is 7.29%.")
    
    # Adding noise lines
    for _ in range(20):
        c.line(random.randint(0, int(width)), random.randint(0, int(height)), 
               random.randint(0, int(width)), random.randint(0, int(height)))
               
    c.showPage()

    # Page 2: Table with misaligned headers and strange terminology
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "FINANCIAL OVERVIEW 2025 (PRO FORMA)")
    
    # We use weird terms for NOI, Cap Rate, Price
    # NOI -> Adjusted Operational Surplus
    # Cap Rate -> Capitalization Metric
    # Price -> Target Consideration
    # GLA -> Total Rentable Envelope
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 150, "Item Name")
    c.drawString(300, height - 140, "Value Amount") # Misaligned header
    
    c.setFont("Helvetica", 10)
    # Row 1
    c.drawString(50, height - 180, "Total Rentable Envelope (sq ft)")
    c.drawString(300, height - 180, "  15,420")
    
    # Row 2 (Confusingly placed)
    c.drawString(50, height - 210, "Gross Potential Revenue")
    c.drawString(300, height - 200, "$450,000") # Misaligned
    
    # Row 3
    c.drawString(50, height - 240, "Adjusted Operational Surplus")
    c.drawString(290, height - 240, "   $310,000.00")
    
    # Row 4
    c.drawString(50, height - 270, "Capitalization Metric")
    c.drawString(300, height - 270, "7.29 %")
    
    # Row 5 (The target consideration)
    c.drawString(50, height - 300, "Target Consideration")
    c.drawString(300, height - 300, "$4,250,000")

    c.save()

if __name__ == "__main__":
    create_messy_pdf("hard_test.pdf")
