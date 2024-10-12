import { Navigation } from "@frontend/components/ui/navigation/navigation";
import { useCanvas } from "@frontend/hooks/use-canvas";
import { getBreakpoints } from "@frontend/utils/breakpoints";
import styles from "./landing.module.css";
import {
  landing_page_mobile,
  landing_page_tablet,
  landing_page_desktop,
} from "@frontend/assets/resources/images";

const { xs, s, m } = getBreakpoints();

export function LandingPage() {
  const { canvasRef } = useCanvas();

  return (
    <div className={styles.container}>
      <Navigation />
      <div className={styles.background}>
        <img
          src={landing_page_mobile}
          srcSet={`${landing_page_mobile} 480w, ${landing_page_tablet} 800w, ${landing_page_desktop} 1440w`}
          sizes={`(max-width: 600px) ${xs}, (max-width: 900px) ${s}, (max-width: 1200px) ${m}`}
          alt="background image landing page"
        />
        <section className={styles.content}>
          <div>
            <canvas ref={canvasRef} className={styles.canvas}>
              <p>Fallback for browsers which do not support Canvas</p>
            </canvas>
          </div>
          <section>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
            laudantium, dignissimos distinctio ex quod veniam quibusdam
            obcaecati consequuntur blanditiis earum harum dolorem esse, illum
            hic reiciendis voluptas, necessitatibus possimus quasi vero
            accusamus ipsum quo nulla provident! At sit ipsa eius sunt facere
            sapiente consequuntur assumenda libero quasi! Ipsum, libero ut?
          </section>
        </section>
      </div>
    </div>
  );
}
