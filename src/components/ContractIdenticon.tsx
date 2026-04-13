import { useEffect, useState } from "react";
import {
  ContractId,
  contractIdenticonSvg,
} from "@/utils/contractIdenticon";

interface ContractIdenticonProps {
  contractId: ContractId;
  size?: number;
  className?: string;
}

export const ContractIdenticon = ({
  contractId,
  size = 32,
  className,
}: ContractIdenticonProps) => {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    contractIdenticonSvg(contractId)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, [contractId]);

  if (!svg) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Identicon for ${contractId}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default ContractIdenticon;
