import { PropsWithChildren } from "react";
import { Navigation } from "@frontend/components/ui/navigation/navigation";
import { ScrollProgressBar } from "@frontend/components/ui/scroll/progress-bar";
import styles from "./page.module.css";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Navigation />
        <ScrollProgressBar />
      </header>
      {children}
      <footer className={styles.footer}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam et
          fuga aliquid tempore debitis corporis veniam modi nihil delectus
          assumenda necessitatibus qui asperiores ullam consequatur voluptatem
          quasi exercitationem, quas magni similique ea. Ratione voluptates
          alias amet quis autem sint dolorem, a voluptatum magnam, incidunt,
          veniam repellat blanditiis. Recusandae accusamus odio, nemo dolorum,
          maxime voluptas minus dignissimos laborum mollitia deserunt quos quas
          blanditiis vitae aliquam consequatur ab atque! Tenetur repudiandae
          nisi quasi quidem similique ea, vitae dolorum reprehenderit ipsum
          optio, veritatis itaque doloribus tempore illum molestiae debitis nam
          consequuntur corporis maxime exercitationem, libero sapiente?
          Quibusdam impedit ab delectus aliquid mollitia voluptas.
        </p>
      </footer>
    </div>
  );
}
