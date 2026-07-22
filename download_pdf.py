import urllib.request

pdf_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
output_path = "C:\\Users\\ACER\\.gemini\\antigravity\\scratch\\cre-matrix-app\\Sample.pdf"

urllib.request.urlretrieve(pdf_url, output_path)
print("PDF Downloaded successfully.")
