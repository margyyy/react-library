import { GlassMenuCard } from "../components/GlassMenuCard";
import PixelBlast from "../components/PixelBlast";

export function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#1a1625]">
      <div className="fixed inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B497CF"
          patternScale={2}
          patternDensity={1}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          speed={0.5}
          transparent
          edgeFade={0.25}
        />
      </div>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-8">
        <div className="flex flex-col gap-5 md:flex-row md:gap-10">
          <GlassMenuCard
            title="BOOKS"
            link="/booksmenu"
          />
          <GlassMenuCard
            title="AUTHORS"
            link="/authors"
          />
        </div>
      </div>
    </div>
  );
}
