import svgPaths from "./svg-wo3d7c3c2";
import imgImage3 from "../assets/6385d7760ec7d1500ad4773d9dad91ae2f8b80a6.png";
import imgImageWithFallback from "../assets/0c1a1c07b690970b46f977390e611d35bfd47a69.png";
import imgImageWithFallback1 from "../assets/d3515d009ba664128bf34cf70552cf8f0229c1a4.png";
import imgImageWithFallback2 from "../assets/623bd1a34db9386cdf9d6dafa0abf25780485896.png";
import imgImageWithFallback3 from "../assets/b24047f1ec78a72b7ee34c55f06e62df6e4e1f35.png";
import imgImage2 from "../assets/ff518fb62b899bc58a1267eea812578ee1da9e50.png";

function Container1() {
  return <div className="absolute bg-gradient-to-b from-[rgba(11,105,125,0.8)] h-[2000.873px] left-0 to-[rgba(11,105,125,0.85)] top-0 via-1/2 via-[rgba(11,105,125,0.7)] w-[1898.035px]" data-name="Container" />;
}

function Container() {
  return (
    <div className="absolute h-[2000.873px] left-0 top-0 w-[1898.035px]" data-name="Container">
      <div className="absolute h-[1611px] left-[-23px] top-[-215px] w-[1921px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3.src} />
      </div>
      <Container1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute bg-[rgba(11,105,125,0.9)] h-[39.996px] left-0 top-[1912.88px] w-[1898.035px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[40px] left-[948.6px] text-[36px] text-center text-white top-[-3.47px] tracking-[1.8px]">#YoSoyPREFECO</p>
    </div>
  );
}

function Section() {
  return (
    <div className="h-[1057px] overflow-clip relative shrink-0 w-full" data-name="Section">
      <Container />
      <Heading1 />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(255,165,45,0.1)] border-[1.118px] border-[rgba(255,165,45,0.2)] border-solid h-[30.233px] left-[555.27px] overflow-clip rounded-[10px] top-0 w-[137.455px]" data-name="Badge">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[68.5px] text-[#ffa52d] text-[14px] text-center top-[2px]">Nuestra Historia</p>
    </div>
  );
}

function LandingPage1() {
  return (
    <div className="absolute h-[47.996px] left-0 top-[46.23px] w-[1247.995px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[48px] left-[624.39px] text-[#0b697d] text-[48px] text-center top-[-5.94px]">Una Tradición de Excelencia</p>
    </div>
  );
}

function LandingPage2() {
  return (
    <div className="absolute h-[55.995px] left-[240px] top-[110.23px] w-[767.985px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[384.02px] text-[#4a5565] text-[18px] text-center top-[-0.76px] w-[754px] whitespace-pre-wrap">Desde 1956, formando generaciones de michoacanos comprometidos con el conocimiento y el desarrollo de su comunidad</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[166.221px] relative shrink-0 w-full" data-name="Container">
      <Badge />
      <LandingPage1 />
      <LandingPage2 />
    </div>
  );
}

function LandingPage3() {
  return <div className="bg-gradient-to-b from-[#0b697d] h-[7.999px] shrink-0 to-[#ffa52d] w-[605.763px]" data-name="LandingPage" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d="M13.3322 15.9986H18.665" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d="M13.3322 10.6657H18.665" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p34ec3e40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p16e51a00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p34d5f100} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative rounded-[37507300px] shrink-0 size-[63.994px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex h-[31.997px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#0b697d] text-[24px]">Fundación</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] top-[-1.88px]">Morelia, 1956</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[59.995px] relative shrink-0 w-[116.811px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading2 />
        <Paragraph />
      </div>
    </div>
  );
}

function LandingPage4() {
  return (
    <div className="content-stretch flex gap-[15.999px] h-[63.994px] items-start relative shrink-0 w-full" data-name="LandingPage">
      <Container4 />
      <Container5 />
    </div>
  );
}

function LandingPage5() {
  return (
    <div className="h-[77.967px] relative shrink-0 w-full" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#364153] text-[16px] top-[-1.76px] w-[527px] whitespace-pre-wrap">El modelo de cooperativas educativas en México fue impulsado por Lázaro Cárdenas desde finales de los años 30, estableciendo las bases de lo que hoy conocemos como el sistema PREFECO.</p>
    </div>
  );
}

function LandingPage6() {
  return (
    <div className="h-[77.967px] relative shrink-0 w-full" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#364153] text-[16px] top-[-1.76px] w-[538px] whitespace-pre-wrap">{`PREFECO "Melchor Ocampo" representa la fusión perfecta entre la gestión ciudadana y la excelencia académica, siendo modelo para otras instituciones en todo el estado.`}</p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[315.92px] relative shrink-0 w-[605.763px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.998px] items-start pt-[31.997px] px-[31.997px] relative size-full">
        <LandingPage4 />
        <LandingPage5 />
        <LandingPage6 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[23.998px] h-[408.523px] items-start left-0 p-[1.118px] rounded-[16px] top-0 w-[607.999px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.118px] border-[rgba(11,105,125,0.2)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <LandingPage3 />
      <CardContent />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p9c98700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29f3b830} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p354f4480} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage7() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="LandingPage" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 45) 0%, rgba(255, 165, 45, 0.8) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#0b697d] text-[16px] top-[-1.88px]">Misión</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[45.516px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-1.88px] w-[493px] whitespace-pre-wrap">Formar bachilleres con sólidos conocimientos académicos, capacidades técnicas y valores cívicos para su desarrollo integral.</p>
    </div>
  );
}

function LandingPage8() {
  return (
    <div className="h-[77.513px] relative shrink-0 w-[492.656px]" data-name="LandingPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.999px] items-start relative size-full">
        <Heading3 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white h-[125.509px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-l-[3.353px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex gap-[15.999px] items-start pl-[27.351px] pt-[23.998px] relative size-full">
        <LandingPage7 />
        <LandingPage8 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p33f67f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M19.9982 1.99982V5.99982" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M21.9984 3.99965H17.9984" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p304e6a00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage9() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="LandingPage" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 45) 0%, rgba(255, 165, 45, 0.8) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#0b697d] text-[16px] top-[-1.88px]">Visión</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[45.516px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-1.88px] w-[491px] whitespace-pre-wrap">Ser la institución de nivel medio superior líder en Michoacán, reconocida por su excelencia académica y compromiso social.</p>
    </div>
  );
}

function LandingPage10() {
  return (
    <div className="h-[77.513px] relative shrink-0 w-[492.656px]" data-name="LandingPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.999px] items-start relative size-full">
        <Heading4 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white h-[125.509px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-l-[3.353px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex gap-[15.999px] items-start pl-[27.351px] pt-[23.998px] relative size-full">
        <LandingPage9 />
        <LandingPage10 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p1c238900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage11() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="LandingPage" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 45) 0%, rgba(255, 165, 45, 0.8) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#0b697d] text-[16px] top-[-1.88px]">Valores</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[45.516px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-1.88px] w-[480px] whitespace-pre-wrap">Responsabilidad, cooperación, integridad académica, respeto a la diversidad y compromiso con la comunidad.</p>
    </div>
  );
}

function LandingPage12() {
  return (
    <div className="h-[77.513px] relative shrink-0 w-[492.656px]" data-name="LandingPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.999px] items-start relative size-full">
        <Heading5 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white h-[125.509px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-l-[3.353px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex gap-[15.999px] items-start pl-[27.351px] pt-[23.998px] relative size-full">
        <LandingPage11 />
        <LandingPage12 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.999px] h-[408.523px] items-start left-[640px] top-0 w-[607.999px]" data-name="Container">
      <Container7 />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[408.523px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Container6 />
    </div>
  );
}

function Section1() {
  return (
    <div className="bg-white h-[846.721px] relative shrink-0 w-full" data-name="Section">
      <div className="content-stretch flex flex-col gap-[63.994px] items-start pt-[79.993px] px-[325.02px] relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(11,105,125,0.1)] border-[1.118px] border-[rgba(11,105,125,0.2)] border-solid h-[30.233px] left-[546.82px] overflow-clip rounded-[10px] top-0 w-[154.345px]" data-name="Badge">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[76.5px] text-[#0b697d] text-[14px] text-center top-[2px]">Formación Integral</p>
    </div>
  );
}

function LandingPage13() {
  return (
    <div className="absolute h-[47.996px] left-0 top-[46.23px] w-[1247.995px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[48px] left-[624.71px] text-[#0b697d] text-[48px] text-center top-[-5.94px]">Modelo Educativo</p>
    </div>
  );
}

function LandingPage14() {
  return (
    <div className="absolute h-[27.998px] left-[240px] top-[110.23px] w-[767.985px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[384.18px] text-[#4a5565] text-[18px] text-center top-[-0.76px]">Bachillerato general con capacitaciones para el trabajo y enfoque en desarrollo integral</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[138.224px] relative shrink-0 w-full" data-name="Container">
      <Badge1 />
      <LandingPage13 />
      <LandingPage14 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d="M15.9986 9.33252V27.9975" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.pbe86d80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage15() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon4 />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.424px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Bachillerato General</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.42px]" data-name="CardHeader">
      <LandingPage15 />
      <CardTitle />
    </div>
  );
}

function LandingPage16() {
  return (
    <div className="absolute h-[77.967px] left-[24px] top-[161.98px] w-[344.424px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[334px] whitespace-pre-wrap">Programa académico completo que prepara para el nivel superior con enfoque en ciencias y humanidades.</p>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-0 rounded-[16px] top-0 w-[394.655px]" data-name="Card">
      <CardHeader />
      <LandingPage16 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.pb572500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d="M29.3308 13.3322V21.3315" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p1f8cca40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage17() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon5 />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.441px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Capacitación Técnica</p>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.437px]" data-name="CardHeader">
      <LandingPage17 />
      <CardTitle1 />
    </div>
  );
}

function LandingPage18() {
  return (
    <div className="absolute h-[51.978px] left-[24px] top-[161.98px] w-[344.441px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[309px] whitespace-pre-wrap">Especialidades en Administración, Higiene y Salud, Tecnologías de la Información y más.</p>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-[426.65px] rounded-[16px] top-0 w-[394.673px]" data-name="Card">
      <CardHeader1 />
      <LandingPage18 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.pfed3a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p35161e00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p23b89c80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.pbc6ab00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage19() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon6 />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.424px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Interculturalidad</p>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.42px]" data-name="CardHeader">
      <LandingPage19 />
      <CardTitle2 />
    </div>
  );
}

function LandingPage20() {
  return (
    <div className="absolute h-[77.967px] left-[24px] top-[161.98px] w-[344.424px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[313px] whitespace-pre-wrap">Único plantel con Departamento de Interculturalidad, promoviendo la diversidad cultural.</p>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-[853.32px] rounded-[16px] top-0 w-[394.655px]" data-name="Card">
      <CardHeader2 />
      <LandingPage20 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.p12919c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p31d56400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p1b1ccde0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d="M5.33287 29.3308H26.6643" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p7d46b80} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p196f3a80} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage21() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon7 />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.424px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Olimpiadas del Conocimiento</p>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.42px]" data-name="CardHeader">
      <LandingPage21 />
      <CardTitle3 />
    </div>
  );
}

function LandingPage22() {
  return (
    <div className="absolute h-[51.978px] left-[24px] top-[161.98px] w-[344.424px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[343px] whitespace-pre-wrap">Alumnos destacados y ganadores en Olimpiadas de Biología y Química a nivel nacional.</p>
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-0 rounded-[16px] top-[298.17px] w-[394.655px]" data-name="Card">
      <CardHeader3 />
      <LandingPage22 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d="M13.3322 15.9986H18.665" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d="M13.3322 10.6657H18.665" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p34ec3e40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p16e51a00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p34d5f100} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage23() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon8 />
    </div>
  );
}

function CardTitle4() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.441px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Cantera UMSNH</p>
    </div>
  );
}

function CardHeader4() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.437px]" data-name="CardHeader">
      <LandingPage23 />
      <CardTitle4 />
    </div>
  );
}

function LandingPage24() {
  return (
    <div className="absolute h-[77.967px] left-[24px] top-[161.98px] w-[344.441px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[303px] whitespace-pre-wrap">Principal fuente de estudiantes para la Universidad Michoacana de San Nicolás de Hidalgo.</p>
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-[426.65px] rounded-[16px] top-[298.17px] w-[394.673px]" data-name="Card">
      <CardHeader4 />
      <LandingPage24 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.p16d92480} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.pe66280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage25() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#0b697d] items-center justify-center left-[24px] rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[63.994px] to-[#ffa52d] top-[24px]" data-name="LandingPage">
      <Icon9 />
    </div>
  );
}

function CardTitle5() {
  return (
    <div className="absolute h-[27.998px] left-[24px] top-[109.98px] w-[344.424px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#0b697d] text-[20px] top-[-1.88px]">Gestión Ciudadana</p>
    </div>
  );
}

function CardHeader5() {
  return (
    <div className="absolute h-[137.979px] left-0 top-0 w-[392.42px]" data-name="CardHeader">
      <LandingPage25 />
      <CardTitle5 />
    </div>
  );
}

function LandingPage26() {
  return (
    <div className="absolute h-[51.978px] left-[24px] top-[161.98px] w-[344.424px]" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-[-1.76px] w-[312px] whitespace-pre-wrap">Modelo cooperativo único con participación activa de padres de familia en la gestión.</p>
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[266.178px] left-[853.32px] rounded-[16px] top-[298.17px] w-[394.655px]" data-name="Card">
      <CardHeader5 />
      <LandingPage26 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[564.352px] relative shrink-0 w-full" data-name="Container">
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
      <Card5 />
      <Card6 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[766.57px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[63.994px] items-start px-[15.999px] relative size-full">
        <Container11 />
        <Container12 />
      </div>
    </div>
  );
}

function Section2() {
  return (
    <div className="bg-white h-[926.556px] relative shrink-0 w-full" data-name="Section">
      <div className="content-stretch flex flex-col items-start pt-[79.993px] px-[309.021px] relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[48.066px] items-start left-[190.6px] top-[7.53px] w-[151.969px]" data-name="Text">
      <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[40px] relative shrink-0 text-[#ffa52d] text-[36px] text-center">PREFECO</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute bg-[#0b697d] h-[63.994px] left-[761.73px] top-[79.99px] w-[374.57px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[40px] left-[111.5px] text-[36px] text-center text-white top-[8.53px]">GALERÍA</p>
      <Text />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback.src} />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[150.327px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Danza Folclórica</p>
      </div>
    </div>
  );
}

function LandingPage27() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-0 overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-0 w-[400px]" data-name="Container">
      <ImageWithFallback />
      <LandingPage27 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1.src} />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[98.629px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Deportes</p>
      </div>
    </div>
  );
}

function LandingPage28() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph5 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-[424px] overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-0 w-[400px]" data-name="Container">
      <ImageWithFallback1 />
      <LandingPage28 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback2.src} />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[115.344px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Graduación</p>
      </div>
    </div>
  );
}

function LandingPage29() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph6 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-[848px] overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-0 w-[400px]" data-name="Container">
      <ImageWithFallback2 />
      <LandingPage29 />
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback.src} />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[165.034px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Eventos Culturales</p>
      </div>
    </div>
  );
}

function LandingPage30() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph7 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-0 overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[248.99px] w-[400px]" data-name="Container">
      <ImageWithFallback3 />
      <LandingPage30 />
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback3.src} />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[103.449px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Biblioteca</p>
      </div>
    </div>
  );
}

function LandingPage31() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph8 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-[424px] overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[248.99px] w-[400px]" data-name="Container">
      <ImageWithFallback4 />
      <LandingPage31 />
    </div>
  );
}

function ImageWithFallback5() {
  return (
    <div className="absolute h-[224.993px] left-0 top-0 w-[400px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1.src} />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[125.544px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[24px] left-[16px] text-[16px] text-white top-[14.12px]">Instalaciones</p>
      </div>
    </div>
  );
}

function LandingPage32() {
  return (
    <div className="absolute bg-gradient-to-t content-stretch flex from-[rgba(11,105,125,0.8)] h-[224.993px] items-end left-0 to-[rgba(0,0,0,0)] top-0 w-[400px]" data-name="LandingPage">
      <Paragraph9 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[224.993px] left-[848px] overflow-clip rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[248.99px] w-[400px]" data-name="Container">
      <ImageWithFallback5 />
      <LandingPage32 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[473.985px] left-[325.02px] top-[239.98px] w-[1247.995px]" data-name="Container">
      <Container14 />
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#ffa52d] h-[39.996px] left-[872.31px] rounded-[10px] top-[761.96px] w-[153.419px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[77.5px] text-[14px] text-center text-white top-[7.99px]">Ver Más Fotos</p>
    </div>
  );
}

function Section3() {
  return (
    <div className="bg-white h-[881.949px] relative shrink-0 w-full" data-name="Section">
      <Heading />
      <Container13 />
      <Button />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(11,105,125,0.1)] border-[1.118px] border-[rgba(11,105,125,0.2)] border-solid h-[30.233px] left-[564.09px] overflow-clip rounded-[10px] top-0 w-[119.797px]" data-name="Badge">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[59px] text-[#0b697d] text-[14px] text-center top-[2px]">Red PREFECO</p>
    </div>
  );
}

function LandingPage33() {
  return (
    <div className="absolute h-[47.996px] left-0 top-[46.23px] w-[1247.995px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[48px] left-[624.24px] text-[#0b697d] text-[48px] text-center top-[-5.94px]">Nuestros Planteles</p>
    </div>
  );
}

function LandingPage34() {
  return (
    <div className="absolute h-[27.998px] left-[240px] top-[110.23px] w-[767.985px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[383.72px] text-[#4a5565] text-[18px] text-center top-[-0.76px]">8 planteles en todo Michoacán comprometidos con la excelencia educativa</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[138.224px] left-[16px] top-0 w-[1247.995px]" data-name="Container">
      <Badge2 />
      <LandingPage33 />
      <LandingPage34 />
    </div>
  );
}

function LandingPage35() {
  return <div className="bg-gradient-to-b from-[#0b697d] h-[11.999px] shrink-0 to-[#0b697d] via-1/2 via-[#ffa52d] w-[1241.289px]" data-name="LandingPage" />;
}

function Badge3() {
  return (
    <div className="bg-[#ffa52d] h-[26.216px] relative rounded-[10px] shrink-0 w-[120.112px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-white">Plantel Principal</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.118px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Badge4() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[98.873px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0b697d] text-[12px]">68° aniversario</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#0b697d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[11.999px] h-[26.216px] items-center relative shrink-0 w-full" data-name="Container">
      <Badge3 />
      <Badge4 />
    </div>
  );
}

function CardTitle6() {
  return (
    <div className="h-[35.997px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-0 text-[#0b697d] text-[30px] top-[-3.24px]">{`PREFECO "Melchor Ocampo"`}</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#4a5565] text-[18px] top-[-0.76px] w-[156px] whitespace-pre-wrap">Morelia, Michoacán</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[110.209px] relative shrink-0 w-[381.504px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.999px] items-start relative size-full">
        <Container23 />
        <CardTitle6 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[47.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47.9958 47.9958">
        <g id="Icon">
          <path d={svgPaths.p32d64f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99965" />
          <path d="M43.9961 19.9982V31.9972" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99965" />
          <path d={svgPaths.p3394f680} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99965" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-gradient-to-b flex-[1_0_0] from-[#0b697d] h-[95.992px] min-h-px min-w-px relative rounded-[37507300px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] to-[#ffa52d]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <Icon10 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 size-[95.992px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container25 />
      </div>
    </div>
  );
}

function LandingPage36() {
  return (
    <div className="absolute content-stretch flex h-[110.209px] items-center justify-between left-[24px] top-[24px] w-[1193.293px]" data-name="LandingPage">
      <Container22 />
      <Container24 />
    </div>
  );
}

function CardHeader6() {
  return (
    <div className="bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[141.315px] relative shrink-0 to-[rgba(255,165,45,0.05)] w-[1241.289px]" data-name="CardHeader">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-b-[1.118px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <LandingPage36 />
      </div>
    </div>
  );
}

function LandingPage37() {
  return (
    <div className="h-[29.255px] relative shrink-0 w-full" data-name="LandingPage">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[29.25px] left-0 text-[#364153] text-[18px] top-[-1.76px]">La institución más emblemática del sistema en Michoacán. Se distingue por su alto nivel académico y su estructura de gestión ciudadana.</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-0 size-[23.998px] top-[1.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p6625600} id="Vector" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p335a4300} id="Vector_2" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p173be500} id="Vector_3" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M3.99965 21.9981H19.9982" id="Vector_4" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p7428d80} id="Vector_5" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p335e7780} id="Vector_6" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <Icon11 />
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-[32px] text-[#0b697d] text-[18px] top-[-0.76px]">Logros Destacados</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[19.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_845)" id="Icon">
          <path d={svgPaths.p3e1c7c00} id="Vector" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p2c90da40} id="Vector_2" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_845">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[294.821px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">Ganadores en olimpiadas de Biología y Química</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#e3e3e3] gap-[11.999px] h-[54.231px] items-center left-0 pl-[17.117px] pr-[1.118px] py-[1.118px] rounded-[12px] to-white top-0 w-[582.639px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon12 />
      <Text1 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[19.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_845)" id="Icon">
          <path d={svgPaths.p3e1c7c00} id="Vector" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p2c90da40} id="Vector_2" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_845">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[201.362px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">Principal cantera para la UMSNH</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#e3e3e3] gap-[11.999px] h-[54.231px] items-center left-[594.64px] pl-[17.117px] pr-[1.118px] py-[1.118px] rounded-[12px] to-white top-0 w-[582.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon13 />
      <Text2 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[19.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_845)" id="Icon">
          <path d={svgPaths.p3e1c7c00} id="Vector" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p2c90da40} id="Vector_2" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_845">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[251.786px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">Departamento de Interculturalidad único</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#e3e3e3] gap-[11.999px] h-[54.231px] items-center left-0 pl-[17.117px] pr-[1.118px] py-[1.118px] rounded-[12px] to-white top-[66.23px] w-[582.639px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon14 />
      <Text3 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[19.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_845)" id="Icon">
          <path d={svgPaths.p3e1c7c00} id="Vector" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p2c90da40} id="Vector_2" stroke="var(--stroke-0, #FFA52D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_845">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[295.433px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">Bachillerato general con capacitaciones diversas</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#e3e3e3] gap-[11.999px] h-[54.231px] items-center left-[594.64px] pl-[17.117px] pr-[1.118px] py-[1.118px] rounded-[12px] to-white top-[66.23px] w-[582.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon15 />
      <Text4 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[120.461px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
    </div>
  );
}

function LandingPage38() {
  return (
    <div className="content-stretch flex flex-col gap-[15.999px] h-[164.457px] items-start relative shrink-0 w-full" data-name="LandingPage">
      <Heading6 />
      <Container26 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-0 size-[19.998px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_784)" id="Icon">
          <path d={svgPaths.p2b2a9300} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p2005500} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_784">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px relative text-[#0b697d] text-[14px] whitespace-pre-wrap">Dirección</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">Calzada Juárez #159, Col. Centro, C.P. 58000</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.996px] items-start left-[32px] top-0 w-[271.802px]" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[39.996px] relative shrink-0 w-full" data-name="Container">
      <Icon16 />
      <Container33 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-0 size-[19.998px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_777)" id="Icon">
          <path d={svgPaths.p5547900} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_777">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-0 w-[196.245px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px relative text-[#0b697d] text-[14px] whitespace-pre-wrap">Teléfono</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[20px] w-[196.245px]" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">(443) 312 2144 / (443) 317 7771</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[39.996px] left-[32px] top-0 w-[196.245px]" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[39.996px] relative shrink-0 w-full" data-name="Container">
      <Icon17 />
      <Container35 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.999px] h-[91.992px] items-start left-[25.12px] top-[25.12px] w-[551.532px]" data-name="Container">
      <Container32 />
      <Container34 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-0 size-[19.998px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_780)" id="Icon">
          <path d={svgPaths.p23d8c300} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p186d3e30} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_780">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px relative text-[#0b697d] text-[14px] whitespace-pre-wrap">Correo</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">contacto@prefecomelchorocampo.edu.mx</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.996px] items-start left-[32px] top-0 w-[262.51px]" data-name="Container">
      <Paragraph15 />
      <Paragraph16 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[39.996px] relative shrink-0 w-full" data-name="Container">
      <Icon18 />
      <Container38 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[19.998px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9982 19.9982">
        <g clipPath="url(#clip0_2_772)" id="Icon">
          <path d={svgPaths.p14c71400} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d="M18.3317 8.3326V13.3322" id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
          <path d={svgPaths.p37686280} id="Vector_3" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66652" />
        </g>
        <defs>
          <clipPath id="clip0_2_772">
            <rect fill="white" height="19.9982" width="19.9982" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-0 w-[195.284px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px relative text-[#0b697d] text-[14px] whitespace-pre-wrap">Sitio Web</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[20px] w-[195.284px]" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px]">prefecomelchorocampo.edu.mx</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute h-[39.996px] left-[32px] top-0 w-[195.284px]" data-name="Container">
      <Paragraph17 />
      <Paragraph18 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[39.996px] relative shrink-0 w-full" data-name="Container">
      <Icon19 />
      <Container40 />
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.999px] h-[91.992px] items-start left-[600.65px] top-[25.12px] w-[551.532px]" data-name="Container">
      <Container37 />
      <Container39 />
    </div>
  );
}

function LandingPage39() {
  return (
    <div className="bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[142.223px] relative rounded-[16px] shrink-0 to-[rgba(255,165,45,0.05)] w-full" data-name="LandingPage">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container31 />
      <Container36 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="h-[447.926px] relative shrink-0 w-[1241.289px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.998px] items-start pt-[31.998px] px-[31.997px] relative size-full">
        <LandingPage37 />
        <LandingPage38 />
        <LandingPage39 />
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-white h-[655.943px] left-[16px] rounded-[16px] top-[202.22px] w-[1247.995px]" data-name="Card">
      <div className="content-stretch flex flex-col gap-[23.998px] items-start overflow-clip p-[3.353px] relative rounded-[inherit] size-full">
        <LandingPage35 />
        <CardHeader6 />
        <CardContent1 />
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[3.353px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute content-stretch flex h-[31.997px] items-start left-[16px] top-[906.16px] w-[1247.995px]" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[32px] min-h-px min-w-px relative text-[#0b697d] text-[24px] text-center whitespace-pre-wrap">Otros Planteles en Michoacán</p>
    </div>
  );
}

function LandingPage40() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Badge5() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[57.672px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Zacapu</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage41() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container42 />
      <Badge5 />
    </div>
  );
}

function CardTitle7() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Emiliano Zapata"`}</p>
    </div>
  );
}

function CardHeader7() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage41 />
      <CardTitle7 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(436) 363 5511</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon21 />
      <Text5 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[127.22px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">ortiz6771@outlook.com</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon22 />
      <Text6 />
    </div>
  );
}

function LandingPage42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Card8() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-0 rounded-[16px] top-0 w-[294px]" data-name="Card">
      <LandingPage40 />
      <CardHeader7 />
      <LandingPage42 />
    </div>
  );
}

function LandingPage43() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Badge6() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[82.875px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Nueva Italia</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage44() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container45 />
      <Badge6 />
    </div>
  );
}

function CardTitle8() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Melchor Ocampo"`}</p>
    </div>
  );
}

function CardHeader8() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage44 />
      <CardTitle8 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(425) 535 2232</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon24 />
      <Text7 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[163.689px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">prepamelchor83@hotmail.com</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon25 />
      <Text8 />
    </div>
  );
}

function LandingPage45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container46 />
      <Container47 />
    </div>
  );
}

function Card9() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-[318px] rounded-[16px] top-0 w-[294px]" data-name="Card">
      <LandingPage43 />
      <CardHeader8 />
      <LandingPage45 />
    </div>
  );
}

function LandingPage46() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Badge7() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[71.47px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Pátzcuaro</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage47() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container48 />
      <Badge7 />
    </div>
  );
}

function CardTitle9() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Silviano Carrillo"`}</p>
    </div>
  );
}

function CardHeader9() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage47 />
      <CardTitle9 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(434) 342 0687</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon27 />
      <Text9 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[112.095px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">instscc@hotmail.com</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon28 />
      <Text10 />
    </div>
  );
}

function LandingPage48() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container49 />
      <Container50 />
    </div>
  );
}

function Card10() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-[636px] rounded-[16px] top-0 w-[294px]" data-name="Card">
      <LandingPage46 />
      <CardHeader9 />
      <LandingPage48 />
    </div>
  );
}

function LandingPage49() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Badge8() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[56.746px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Cherán</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage50() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container51 />
      <Badge8 />
    </div>
  );
}

function CardTitle10() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Benito Juárez"`}</p>
    </div>
  );
}

function CardHeader10() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage50 />
      <CardTitle10 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(423) 594 2097</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon30 />
      <Text11 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[186.516px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">preparatoriacheran146@gmail.com</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon31 />
      <Text12 />
    </div>
  );
}

function LandingPage51() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container52 />
      <Container53 />
    </div>
  );
}

function Card11() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-[953.99px] rounded-[16px] top-0 w-[294px]" data-name="Card">
      <LandingPage49 />
      <CardHeader10 />
      <LandingPage51 />
    </div>
  );
}

function LandingPage52() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Badge9() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[69.409px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Zitácuaro</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage53() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container54 />
      <Badge9 />
    </div>
  );
}

function CardTitle11() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Melchor Ocampo"`}</p>
    </div>
  );
}

function CardHeader11() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage53 />
      <CardTitle11 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(715) 153 0341</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon33 />
      <Text13 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[170.273px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">prefeco_zitacuaro@hotmail.com</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon34 />
      <Text14 />
    </div>
  );
}

function LandingPage54() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Card12() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-0 rounded-[16px] top-[276.2px] w-[294px]" data-name="Card">
      <LandingPage52 />
      <CardHeader11 />
      <LandingPage54 />
    </div>
  );
}

function LandingPage55() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Badge10() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[90.577px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Huandacareo</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage56() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container57 />
      <Badge10 />
    </div>
  );
}

function CardTitle12() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Cuauhtémoc"`}</p>
    </div>
  );
}

function CardHeader12() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage56 />
      <CardTitle12 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(455) 358 0175</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon36 />
      <Text15 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[137.944px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">viktormmm@hotmail.com</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon37 />
      <Text16 />
    </div>
  );
}

function LandingPage57() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container58 />
      <Container59 />
    </div>
  );
}

function Card13() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-[318px] rounded-[16px] top-[276.2px] w-[294px]" data-name="Card">
      <LandingPage55 />
      <CardHeader12 />
      <LandingPage57 />
    </div>
  );
}

function LandingPage58() {
  return <div className="absolute bg-gradient-to-b from-[#0b697d] h-[7.999px] left-0 to-[#ffa52d] top-0 w-[291.765px]" data-name="LandingPage" />;
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d="M9.99912 11.9989H13.9991" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M9.99912 7.9993H13.9991" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p29639ba0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p10d48500} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p5b4cb00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative rounded-[37507300px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Badge11() {
  return (
    <div className="h-[22.216px] relative rounded-[10px] shrink-0 w-[106.244px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.118px] py-[3.118px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#ffa52d] text-[12px]">Santa Ana Maya</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#ffa52d] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LandingPage59() {
  return (
    <div className="absolute content-stretch flex h-[47.996px] items-start justify-between left-[24px] top-[24px] w-[243.769px]" data-name="LandingPage">
      <Container60 />
      <Badge11 />
    </div>
  );
}

function CardTitle13() {
  return (
    <div className="absolute h-[19.998px] left-[24px] top-[85.98px] w-[243.769px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0b697d] text-[16px] top-[-2.12px]">{`PREFECO "Melchor Ocampo"`}</p>
    </div>
  );
}

function CardHeader13() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(11,105,125,0.05)] h-[117.981px] left-0 to-[rgba(0,0,0,0)] top-[32px] w-[291.765px]" data-name="CardHeader">
      <LandingPage59 />
      <CardTitle13 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_842)" id="Icon">
          <path d={svgPaths.pedc700} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_842">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[78.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">(455) 384 2949</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon39 />
      <Text17 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[11.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9989 11.9989">
        <g clipPath="url(#clip0_2_753)" id="Icon">
          <path d={svgPaths.p25bfd980} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
          <path d={svgPaths.p48f2400} id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999912" />
        </g>
        <defs>
          <clipPath id="clip0_2_753">
            <rect fill="white" height="11.9989" width="11.9989" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[15.999px] relative shrink-0 w-[151.69px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#364153] text-[12px] top-[-2.12px]">guadalupe.mc@hotmail.com</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[15.999px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon40 />
      <Text18 />
    </div>
  );
}

function LandingPage60() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.999px] h-[39.996px] items-start left-[24px] top-[185.97px] w-[243.769px]" data-name="LandingPage">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Card14() {
  return (
    <div className="absolute bg-white border-[#e3e3e3] border-[1.118px] border-solid h-[252.205px] left-[636px] rounded-[16px] top-[276.2px] w-[294px]" data-name="Card">
      <LandingPage58 />
      <CardHeader13 />
      <LandingPage60 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[528.408px] left-[16px] top-[970.15px] w-[1247.995px]" data-name="Container">
      <Card8 />
      <Card9 />
      <Card10 />
      <Card11 />
      <Card12 />
      <Card13 />
      <Card14 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[1498.559px] relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Card7 />
      <Heading7 />
      <Container41 />
    </div>
  );
}

function Section4() {
  return (
    <div className="bg-white h-[1658.545px] relative shrink-0 w-full" data-name="Section">
      <div className="content-stretch flex flex-col items-start pt-[79.993px] px-[309.021px] relative size-full">
        <Container20 />
      </div>
    </div>
  );
}

function Badge12() {
  return (
    <div className="absolute bg-[rgba(255,165,45,0.1)] border-[1.118px] border-[rgba(255,165,45,0.2)] border-solid h-[30.233px] left-[567.34px] overflow-clip rounded-[10px] top-0 w-[113.318px]" data-name="Badge">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[56.5px] text-[#ffa52d] text-[14px] text-center top-[2px]">Contáctanos</p>
    </div>
  );
}

function LandingPage61() {
  return (
    <div className="absolute h-[47.996px] left-0 top-[46.23px] w-[1247.995px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[48px] left-[624.03px] text-[#0b697d] text-[48px] text-center top-[-5.94px]">¿Tienes Preguntas?</p>
    </div>
  );
}

function LandingPage62() {
  return (
    <div className="absolute h-[27.998px] left-[240px] top-[110.23px] w-[767.985px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[383.57px] text-[#4a5565] text-[18px] text-center top-[-0.76px]">Estamos aquí para ayudarte. Comunícate con nosotros para más información</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[138.224px] left-[325.02px] top-[79.99px] w-[1247.995px]" data-name="Container">
      <Badge12 />
      <LandingPage61 />
      <LandingPage62 />
    </div>
  );
}

function LandingPage63() {
  return <div className="bg-gradient-to-b from-[#0b697d] h-[11.999px] shrink-0 to-[#0b697d] via-1/2 via-[#ffa52d] w-[1021.762px]" data-name="LandingPage" />;
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[27.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9975 27.9975">
        <g id="Icon">
          <path d={svgPaths.p10806b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33313" />
          <path d={svgPaths.p23c3ef70} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33313" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[55.995px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.017px] relative size-full">
        <Icon41 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0b697d] text-[18px] top-[-0.76px]">Ubicación</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="font-['Arimo:Regular',sans-serif] font-normal h-[47.996px] leading-[24px] relative shrink-0 text-[#364153] text-[16px] w-full" data-name="Paragraph">
      <p className="absolute left-0 top-[-1.88px]">Calzada Juárez #159, Col. Centro</p>
      <p className="absolute left-0 top-[22.12px]">C.P. 58000, Morelia, Michoacán</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[83.993px] relative shrink-0 w-[229.517px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading8 />
        <Paragraph19 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex gap-[15.999px] h-[83.993px] items-start relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Container67 />
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[27.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9975 27.9975">
        <g id="Icon">
          <path d={svgPaths.p2d58dc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33313" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[55.995px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 45) 0%, rgba(255, 165, 45, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.017px] relative size-full">
        <Icon42 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0b697d] text-[18px] top-[-0.76px]">Teléfonos</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="font-['Arimo:Regular',sans-serif] font-normal h-[47.996px] leading-[24px] relative shrink-0 text-[#364153] text-[16px] w-full" data-name="Paragraph">
      <p className="absolute left-0 top-[-1.88px]">(443) 312 2144</p>
      <p className="absolute left-0 top-[22.12px]">(443) 317 7771</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[83.993px] relative shrink-0 w-[104.655px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading9 />
        <Paragraph20 />
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex gap-[15.999px] h-[83.993px] items-start relative shrink-0 w-full" data-name="Container">
      <Container69 />
      <Container70 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[27.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9975 27.9975">
        <g id="Icon">
          <path d={svgPaths.p453d080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33313" />
          <path d={svgPaths.pafe0f00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33313" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[55.995px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.7) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.017px] relative size-full">
        <Icon43 />
      </div>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0b697d] text-[18px] top-[-0.76px]">Correo</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#364153] text-[16px] top-[-1.88px]">contacto@prefecomelchorocampo.edu.mx</p>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[59.995px] relative shrink-0 w-[300.044px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.999px] items-start relative size-full">
        <Heading10 />
        <Paragraph21 />
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex gap-[15.999px] h-[59.995px] items-start relative shrink-0 w-full" data-name="Container">
      <Container72 />
      <Container73 />
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[23.998px] h-[310.209px] items-start left-0 top-0 w-[446.878px]" data-name="Container">
      <Container65 />
      <Container68 />
      <Container71 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[79.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79.993 79.993">
        <g id="Icon">
          <path d={svgPaths.p1df06f00} id="Vector" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6.66608" />
          <path d="M73.3269 33.3304V53.3287" id="Vector_2" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6.66608" />
          <path d={svgPaths.p37300600} id="Vector_3" stroke="var(--stroke-0, #0B697D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6.66608" />
        </g>
      </svg>
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[31.997px] relative shrink-0 w-[228.417px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#0b697d] text-[24px] text-center">Horario de Atención</p>
      </div>
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[21.238px] items-start left-[4.98px] top-[1.12px] w-[120.653px]" data-name="Bold Text">
      <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#364153] text-[16px] text-center">Lunes a Viernes:</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[47.996px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[65.5px] text-[#364153] text-[16px] text-center top-[22.12px]">8:00 AM - 4:00 PM</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[21.238px] items-start left-[35.32px] top-[1.12px] w-[59.977px]" data-name="Bold Text">
      <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#364153] text-[16px] text-center">Sábado:</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[47.996px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText1 />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[65.5px] text-[#364153] text-[16px] text-center top-[22.12px]">9:00 AM - 1:00 PM</p>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[103.991px] relative shrink-0 w-[130.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.999px] items-start relative size-full">
        <Paragraph22 />
        <Paragraph23 />
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.999px] h-[310.209px] items-center justify-center left-[478.88px] pb-[1.118px] pt-[1.119px] px-[1.118px] rounded-[16px] top-0 w-[446.895px]" data-name="Container" style={{ backgroundImage: "linear-gradient(145.234deg, rgba(11, 105, 125, 0.05) 0%, rgba(255, 165, 45, 0.05) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.118px] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon44 />
      <Heading11 />
      <Container75 />
    </div>
  );
}

function LandingPage64() {
  return (
    <div className="h-[310.209px] relative shrink-0 w-full" data-name="LandingPage">
      <Container64 />
      <Container74 />
    </div>
  );
}

function Icon45() {
  return (
    <div className="absolute left-[16px] size-[15.999px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9986 15.9986">
        <g clipPath="url(#clip0_2_800)" id="Icon">
          <path d={svgPaths.p254c4e00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33322" />
          <path d="M14.6654 6.66608V10.6657" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33322" />
          <path d={svgPaths.p15a25f00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33322" />
        </g>
        <defs>
          <clipPath id="clip0_2_800">
            <rect fill="white" height="15.9986" width="15.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#ffa52d] h-[39.996px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <Icon45 />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[138px] text-[14px] text-center text-white top-[7.99px]">Acceder al Sistema ENIEP 2026</p>
    </div>
  );
}

function LandingPage65() {
  return (
    <div className="h-[73.111px] relative shrink-0 w-full" data-name="LandingPage">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-solid border-t-[1.118px] inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-[33.115px] px-[337.176px] relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="h-[487.311px] relative shrink-0 w-[1021.762px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[31.997px] items-start pt-[47.996px] px-[47.996px] relative size-full">
        <LandingPage64 />
        <LandingPage65 />
      </div>
    </div>
  );
}

function Card15() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[23.998px] h-[525.543px] items-start left-[437.01px] p-[1.118px] rounded-[16px] top-[282.21px] w-[1023.998px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.118px] border-[rgba(11,105,125,0.2)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <LandingPage63 />
      <CardContent2 />
    </div>
  );
}

function Section5() {
  return (
    <div className="bg-white h-[887.747px] relative shrink-0 w-full" data-name="Section">
      <Container63 />
      <Card15 />
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] text-white top-[-1.88px]">PREFECO</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)]">Melchor Ocampo</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[47.996px] relative shrink-0 w-[107.187px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading12 />
        <Paragraph24 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex gap-[11.999px] h-[55.995px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="h-[66px] relative shrink-0 w-[69px]" data-name="image 2">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2.src} />
      </div>
      <Container79 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[68.273px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[14px] text-[rgba(255,255,255,0.8)] top-[-1.88px] w-[355px] whitespace-pre-wrap">68 años formando generaciones de michoacanos comprometidos con el conocimiento y el desarrollo de su comunidad.</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.999px] h-[227.98px] items-start left-0 top-0 w-[394.655px]" data-name="Container">
      <Container78 />
      <Paragraph25 />
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-white top-[-0.76px]">Enlaces Rápidos</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[40.87px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">INICIO</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[117.23px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">SOBRE NOSOTROS</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[133.665px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">MODELO EDUCATIVO</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[53.428px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">GALERÍA</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button5 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[69.845px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">PLANTELES</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-0 top-[2.24px] w-[70.352px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-center">CONTACTO</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-full" data-name="List Item">
      <Button7 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[183.984px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.999px] h-[227.98px] items-start left-[426.65px] top-0 w-[394.673px]" data-name="Container">
      <Heading13 />
      <List />
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-white top-[-0.76px]">Contacto</p>
    </div>
  );
}

function Icon46() {
  return (
    <div className="absolute left-0 size-[15.999px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9986 15.9986">
        <g clipPath="url(#clip0_2_796)" id="Icon">
          <path d={svgPaths.p38954000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.33322" />
          <path d={svgPaths.pf523000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.33322" />
        </g>
        <defs>
          <clipPath id="clip0_2_796">
            <rect fill="white" height="15.9986" width="15.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-[24px] top-0 w-[178.831px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)]">Calzada Juárez #159, Morelia</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-full" data-name="List Item">
      <Icon46 />
      <Text19 />
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[15.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9986 15.9986">
        <g clipPath="url(#clip0_2_747)" id="Icon">
          <path d={svgPaths.p381f6d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.33322" />
        </g>
        <defs>
          <clipPath id="clip0_2_747">
            <rect fill="white" height="15.9986" width="15.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[91.555px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)]">(443) 312 2144</p>
      </div>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[19.998px] items-center relative shrink-0 w-full" data-name="List Item">
      <Icon47 />
      <Text20 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="absolute left-0 size-[15.999px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9986 15.9986">
        <g clipPath="url(#clip0_2_814)" id="Icon">
          <path d={svgPaths.p34264f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.33322" />
          <path d={svgPaths.p5d3e680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.33322" />
        </g>
        <defs>
          <clipPath id="clip0_2_814">
            <rect fill="white" height="15.9986" width="15.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute content-stretch flex h-[19.998px] items-start left-[24px] top-0 w-[262.51px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)]">contacto@prefecomelchorocampo.edu.mx</p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-full" data-name="List Item">
      <Icon48 />
      <Text21 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[7.999px] h-[75.993px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem6 />
      <ListItem7 />
      <ListItem8 />
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.999px] h-[227.98px] items-start left-[853.32px] top-0 w-[394.655px]" data-name="Container">
      <Heading14 />
      <List1 />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[227.98px] relative shrink-0 w-full" data-name="Container">
      <Container77 />
      <Container80 />
      <Container81 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="content-stretch flex h-[19.998px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[14px] text-[rgba(255,255,255,0.6)] text-center whitespace-pre-wrap">© 2026 PREFECO Melchor Ocampo. Todos los derechos reservados.</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[27.998px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[28px] left-[624.09px] text-[#ffa52d] text-[18px] text-center top-[-0.76px]">#YoSoyPREFECO</p>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col gap-[7.999px] h-[89.11px] items-start pt-[33.115px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[1.118px] inset-0 pointer-events-none" />
      <Paragraph26 />
      <Paragraph27 />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#0b697d] h-[461.077px] relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col gap-[47.996px] items-start pt-[47.996px] px-[325.02px] relative size-full">
        <Container76 />
        <Container82 />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="absolute bg-[#fffff8] content-stretch flex flex-col h-[6720px] items-start left-0 top-0 w-[1898px]" data-name="LandingPage">
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </div>
  );
}

function Container83() {
  return (
    <div className="h-[87.992px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pt-[11.999px] relative size-full">
          <div className="h-[66px] relative shrink-0 w-[69px]" data-name="image 2">
            <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2.src} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage66() {
  return (
    <div className="absolute content-stretch flex flex-col h-[89.11px] items-start left-0 pb-[1.118px] px-[309.021px] top-0 w-[1898.035px]" data-name="LandingPage">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-b-[1.118px] border-solid inset-0 pointer-events-none" />
      <Container83 />
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[42.25px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#ffa52d] text-[14px] text-center">INICIO</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[119.867px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#0b697d] text-[14px] text-center">SOBRE NOSOTROS</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[137.176px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#0b697d] text-[14px] text-center">MODELO EDUCATIVO</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[55.436px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#0b697d] text-[14px] text-center">GALERÍA</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[72.186px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#0b697d] text-[14px] text-center">PLANTELES</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[72.151px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#0b697d] text-[14px] text-center">CONTACTO</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[19.998px] relative shrink-0 w-[1247.995px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[31.997px] items-center justify-center relative size-full">
        <Button8 />
        <Button9 />
        <Button10 />
        <Button11 />
        <Button12 />
        <Button13 />
      </div>
    </div>
  );
}

function LandingPage67() {
  return (
    <div className="absolute content-stretch flex h-[55.995px] items-center justify-between left-[325.02px] top-[89.11px] w-[1247.995px]" data-name="LandingPage">
      <Container84 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] h-[145.105px] left-0 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] top-0 w-[1898.035px]" data-name="Navigation">
      <LandingPage66 />
      <LandingPage67 />
    </div>
  );
}

function LandingPage68() {
  return (
    <div className="h-[95.992px] relative shrink-0 w-full" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[96px] left-[511.75px] text-[96px] text-center text-white top-[-9.77px] tracking-[-2.4px]">PREFECO</p>
    </div>
  );
}

function LandingPage69() {
  return (
    <div className="h-[47.996px] relative shrink-0 w-full" data-name="LandingPage">
      <div className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[48px] left-[511.67px] text-[48px] text-[rgba(255,255,255,0.95)] text-center top-[-5.94px] whitespace-nowrap">
        <p className="mb-0">Melchor Ocampo</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function LandingPage70() {
  return (
    <div className="content-stretch flex h-[31.997px] items-start relative shrink-0 w-full" data-name="LandingPage">
      <p className="flex-[1_0_0] font-['Arimo:Italic',sans-serif] font-normal italic leading-[32px] min-h-px min-w-px relative text-[24px] text-[rgba(255,255,255,0.9)] text-center whitespace-pre-wrap">Preparación que renueva para el futuro</p>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-col gap-[15.999px] h-[207.982px] items-start relative shrink-0 w-full" data-name="Container">
      <LandingPage68 />
      <LandingPage69 />
      <LandingPage70 />
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute content-stretch flex flex-col h-[507.466px] items-start left-[424px] px-[15.999px] top-[332px] w-[1055.995px]" data-name="Container">
      <Container86 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p25786800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[#ffa52d] relative rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon49 />
      </div>
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.pdeb5d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[#ffa52d] relative rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon50 />
      </div>
    </div>
  );
}

function Icon51() {
  return (
    <div className="relative shrink-0 size-[23.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9979 23.9979">
        <g id="Icon">
          <path d={svgPaths.p8f9f2c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d={svgPaths.p355fe880} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
          <path d="M17.4985 6.49943H17.5085" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99982" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[#ffa52d] relative rounded-[37507300px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[47.996px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon51 />
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.999px] h-[167.985px] items-start left-[1837.01px] top-[501.75px] w-[47.996px]" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function LandingPage71() {
  return <div className="absolute h-[63.994px] left-0 top-[-32px] w-[325.334px]" data-name="LandingPage" />;
}

function CardTitle14() {
  return <div className="absolute h-[27.998px] left-[24px] top-[24px] w-[277.338px]" data-name="CardTitle" />;
}

function CardHeader14() {
  return (
    <div className="absolute h-[69.985px] left-0 top-[71.99px] w-[325.334px]" data-name="CardHeader">
      <CardTitle14 />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[163px] text-[#0b697d] text-[18px] text-center top-[-8.97px]">ADMISIONES</p>
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-[163.5px] text-[#4a5565] text-[14px] text-center top-[38.03px] w-[263px] whitespace-pre-wrap">Consulta toda la información que tenemos para ti y tramita tu ficha.</p>
    </div>
  );
}

function Card16() {
  return (
    <div className="absolute bg-white h-[188px] left-0 overflow-clip rounded-[16px] top-[0.02px] w-[325px]" data-name="Card">
      <LandingPage71 />
      <CardHeader14 />
    </div>
  );
}

function LandingPage72() {
  return <div className="absolute h-[63.994px] left-0 top-[-32px] w-[325.334px]" data-name="LandingPage" />;
}

function CardTitle15() {
  return <div className="absolute h-[27.998px] left-[24px] top-[24px] w-[277.338px]" data-name="CardTitle" />;
}

function CardHeader15() {
  return (
    <div className="absolute h-[69.985px] left-0 top-[71.99px] w-[325.334px]" data-name="CardHeader">
      <CardTitle15 />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[163.17px] text-[#0b697d] text-[18px] text-center top-[-13.97px]">EXPERIENCIA PREFECO</p>
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-[162.67px] text-[#4a5565] text-[14px] text-center top-[35.03px] w-[244px] whitespace-pre-wrap">Vive toda la experiencia de ser parte de nuestra gran comunidad.</p>
    </div>
  );
}

function LandingPage73() {
  return <div className="absolute h-[45.516px] left-[24px] top-[165.98px] w-[277.338px]" data-name="LandingPage" />;
}

function Card17() {
  return (
    <div className="absolute bg-white h-[188px] left-[349px] overflow-clip rounded-[16px] top-[0.02px] w-[326px]" data-name="Card">
      <LandingPage72 />
      <CardHeader15 />
      <LandingPage73 />
    </div>
  );
}

function LandingPage74() {
  return <div className="absolute h-[63.994px] left-0 top-[-32px] w-[325.334px]" data-name="LandingPage" />;
}

function CardTitle16() {
  return <div className="absolute h-[27.998px] left-[24px] top-[24px] w-[277.338px]" data-name="CardTitle" />;
}

function LandingPage75() {
  return (
    <div className="absolute h-[45.516px] left-[23.34px] top-[35.03px] w-[277.338px]" data-name="LandingPage">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-[138.91px] text-[#4a5565] text-[14px] text-center top-[-1.88px] w-[214px] whitespace-pre-wrap">Conoce nuestro plan de estudios y capacitaciones disponibles.</p>
    </div>
  );
}

function CardHeader16() {
  return (
    <div className="absolute h-[69.985px] left-0 top-[71.99px] w-[325.334px]" data-name="CardHeader">
      <CardTitle16 />
      <LandingPage75 />
    </div>
  );
}

function Card18() {
  return (
    <div className="absolute bg-white h-[188px] left-[699px] overflow-clip rounded-[16px] top-[0.02px] w-[325px]" data-name="Card">
      <LandingPage74 />
      <CardHeader16 />
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[162.34px] text-[#0b697d] text-[18px] text-center top-[58.02px]">OFERTA ACADÉMICA</p>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.pa10a7c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d="M29.3308 13.3322V21.3315" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p1f8cca40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[130.66px] rounded-[37507300px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] size-[63.994px] top-[-32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.8) 100%)" }}>
      <Icon52 />
    </div>
  );
}

function Icon53() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d="M15.9986 9.33252V27.9975" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.pbe86d80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[829.32px] rounded-[37507300px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] size-[63.994px] top-[-32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(11, 105, 125) 0%, rgba(11, 105, 125, 0.8) 100%)" }}>
      <Icon53 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute h-[235.49px] left-[440px] top-[603.98px] w-[1023.998px]" data-name="Container">
      <Card16 />
      <Card17 />
      <Card18 />
      <Container89 />
      <Container90 />
    </div>
  );
}

function Icon54() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9972 31.9972">
        <g id="Icon">
          <path d={svgPaths.pfed3a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p1b977100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.p2a9c4400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
          <path d={svgPaths.pbc6ab00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66643" />
        </g>
      </svg>
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[919.99px] rounded-[37507300px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] size-[63.994px] top-[571.98px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 165, 45) 0%, rgba(255, 165, 45, 0.8) 100%)" }}>
      <Icon54 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[424px] top-[332px]">
      <Container85 />
      <Container87 />
      <Container88 />
      <Container91 />
    </div>
  );
}

export default function DisenoUiParaEniep() {
  return (
    <div className="bg-[#fffff8] relative size-full" data-name="Diseño UI para ENIEP 2035">
      <LandingPage />
      <Navigation />
      <Group />
      <p className="-translate-x-1/2 absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-[1764.5px] text-[#0b697d] text-[14px] text-center top-[107px]">INICIAR SESIÓN</p>
    </div>
  );
}