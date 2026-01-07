import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Plugins
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Stores
import { useChatStore } from "../../store/useChatStore";

const ImageViewer = ({
  images,
  isViewerOpen,
  setViewerOpen,
  photoIndex,
  setPhotoIndex,
}) => {
  const { getMoreMessages, getMessageImages } = useChatStore();

  return (
    <div>
      <Lightbox
        open={isViewerOpen}
        close={() => setViewerOpen(false)}
        slides={images}
        carousel={{ finite: true }}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
        plugins={[Download, Zoom, Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 80,
          height: 60,
          gap: 8,
          imageFit: "cover",
        }}
        zoom={{
          maxZoomPixelRatio: 6,
          scrollToZoom: true,
        }}
        on={{
          view: ({ index }) => {
            if (index === getMessageImages().length - 1) {
              getMoreMessages();
            }
          },
        }}
      />
    </div>
  );
};

export default ImageViewer;
