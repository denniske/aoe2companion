import Foundation
import SwiftUI

extension UIImage {
    func imageWith(newSize: CGSize) -> UIImage {
        let image = UIGraphicsImageRenderer(size: newSize).image { _ in
            draw(in: CGRect(origin: .zero, size: newSize))
        }

        return image.withRenderingMode(renderingMode)
    }
}

extension UIColor {
    convenience init(hexString: String) {
        let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int = UInt64()
        Scanner(string: hex).scanHexInt64(&int)
        let a: UInt64
        let r: UInt64
        let g: UInt64
        let b: UInt64
        switch hex.count {
        case 3:  // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:  // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255,
            alpha: CGFloat(a) / 255)
    }

    static func dynamicColor(light: String, dark: String) -> UIColor {
        return UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(hexString: dark) : UIColor(hexString: light)
        }
    }
}

struct NetworkImage: View {
    let url: URL?
    var body: some View {
        Group {
            if let url = url, let imageData = try? Data(contentsOf: url),
                let uiImage = UIImage(data: imageData)
            {
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            }
        }
    }
}

struct NetworkImageIsland: View {
    let url: URL?
    var body: some View {
        Group {
            if let url = url, let imageData = try? Data(contentsOf: url),
                let uiImage = UIImage(data: imageData)
            {
                Image(uiImage: uiImage.imageWith(newSize: CGSize(width: 25, height: 25)))
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            }
        }
    }
}

