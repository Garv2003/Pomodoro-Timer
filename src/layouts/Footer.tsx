import { Maximize, Shrink } from "lucide-solid";

type FooterProps = {
  toggleFullScreen: () => void;
  isFullScreen: () => boolean;  
};
const Footer = (props: FooterProps) => (
  <footer class="fixed bottom-0 right-0 p-5 md:">
    <button onClick={() => props.toggleFullScreen()}>
      {props.isFullScreen() ? <Shrink size="45" /> : <Maximize size="45" />}
    </button>
  </footer>
);

export default Footer;
