// Batch Simplified -> Traditional Chinese with the ICU "Hans-Hant" transform
// that ships with macOS (Foundation). Used by scripts/sync-locales.mjs.
//
// Usage: swift scripts/lib/hans-hant.swift <in.json> <out.json>
//   in.json  = JSON array of strings (Simplified)
//   out.json = JSON array of strings (Traditional), same order
import Foundation

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: hans-hant.swift <in.json> <out.json>\n".data(using: .utf8)!)
  exit(2)
}
let data = try Data(contentsOf: URL(fileURLWithPath: args[1]))
guard let input = try JSONSerialization.jsonObject(with: data) as? [String] else {
  FileHandle.standardError.write("input must be a JSON array of strings\n".data(using: .utf8)!)
  exit(2)
}
let transform = StringTransform(rawValue: "Hans-Hant")
let output = input.map { $0.applyingTransform(transform, reverse: false) ?? $0 }
let out = try JSONSerialization.data(withJSONObject: output, options: [])
try out.write(to: URL(fileURLWithPath: args[2]))
