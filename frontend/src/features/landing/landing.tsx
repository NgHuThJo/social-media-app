import { Image } from "@frontend/components/ui/image/image";
import { Navigation } from "@frontend/components/ui/navigation/navigation";
import { getBreakpoints } from "@frontend/utils/breakpoints";
import styles from "./landing.module.css";
import {
  landing_page_desktop,
  landing_page_mobile,
  landing_page_tablet,
} from "@frontend/assets/resources/images";

const { xs, s } = getBreakpoints();

export function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <Navigation />
      <div className={styles["content-wrapper"]}>
        <Image
          src={landing_page_mobile}
          srcSet={`${landing_page_mobile} 480w, ${landing_page_tablet} 800w, ${landing_page_desktop} 1440w`}
          sizes={`(max-width: ${xs}) 480px, (max-width: ${s}) 800px, 1440px`}
          alt="Background landing page"
        />
        <div className={styles.content}>
          <h1>Welcome to the social media landing page</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit
            aut perferendis sint ullam, architecto, molestias tenetur laudantium
            autem minus animi possimus veritatis nam omnis. Pariatur, amet
            nostrum odio officia vero eum beatae, placeat sequi et quidem ipsam
            molestiae debitis maiores. Aperiam ea cumque, quod hic quas
            consequatur exercitationem! Velit delectus saepe, pariatur officia
            impedit fugiat, voluptatibus quas, distinctio id consequatur quidem.
            Nobis dolorem ut natus repellendus error iure. Quam, eos molestias
            perspiciatis in est voluptatum, qui dolorum enim debitis laboriosam
            voluptate delectus magnam aliquam at error et? Ab tempora maxime
            natus quibusdam vitae est, animi optio dolorem voluptatibus ea
            rerum?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            commodi quo totam nulla. Veniam, quis et voluptatibus recusandae est
            ullam nemo quas, expedita hic, at doloremque perspiciatis veritatis
            minus? Non eos sint placeat animi, suscipit quidem magni libero
            numquam id? Facilis possimus asperiores provident fuga aliquid
            nostrum necessitatibus! Ipsa praesentium repellendus eligendi eum
            fugit sapiente molestiae numquam architecto iure impedit quod,
            recusandae nemo nostrum repellat pariatur ex, porro veritatis minima
            corrupti. Repudiandae officia quod quisquam, molestiae totam nisi
            magnam esse voluptates sit, dolorem dicta debitis blanditiis
            accusamus ex! Vero repellendus ea nobis, tempora labore molestias
            laudantium corrupti perspiciatis! Dignissimos, quis.
          </p>
        </div>
      </div>
    </div>
  );
}
