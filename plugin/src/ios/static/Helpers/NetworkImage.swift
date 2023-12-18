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

struct NetworkImage: View {
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
