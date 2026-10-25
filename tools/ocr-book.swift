// OCR the scanned Delftse Methode PDF into tools/out/book.txt (reference only, never bundled).
// Usage: swift tools/ocr-book.swift book1.pdf tools/out/book.txt
import AppKit
import PDFKit
import Vision

let args = CommandLine.arguments
let input = args.count > 1 ? args[1] : "book1.pdf"
let output = args.count > 2 ? args[2] : "tools/out/book.txt"
guard let doc = PDFDocument(url: URL(fileURLWithPath: input)) else { fatalError("cannot open \(input)") }

func ocr(_ index: Int) -> String {
  guard let page = doc.page(at: index) else { return "" }
  let box = page.bounds(for: .mediaBox)
  let scale: CGFloat = 2000 / max(box.width, box.height)
  let image = page.thumbnail(of: NSSize(width: box.width * scale, height: box.height * scale), for: .mediaBox)
  guard let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { return "" }
  let request = VNRecognizeTextRequest()
  request.recognitionLanguages = ["nl-NL", "en-US"]
  request.recognitionLevel = .accurate
  try? VNImageRequestHandler(cgImage: cg).perform([request])
  return (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
}

var out = ""
for i in 0..<doc.pageCount {
  out += "\n=== PAGE \(i + 1) ===\n" + ocr(i)
}
try! out.write(toFile: output, atomically: true, encoding: .utf8)
print("wrote \(doc.pageCount) pages to \(output)")
