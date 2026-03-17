import { ComparisonTest } from "@/components/test/forms/comparison-test";
import { IdealPartnerTest } from "@/components/test/forms/ideal-partner-test";
import { PersonalityTest } from "@/components/test/forms/personality-test";
import { SecretCrushTest } from "@/components/test/forms/secret-crush-test";

type PublicTestFormProps = {
  slug: string;
  campaignName: string;
  testType?: string | null;
};

export function PublicTestForm({
  slug,
  campaignName,
  testType,
}: PublicTestFormProps) {
  switch (testType) {
    case "ideal":
      return <IdealPartnerTest slug={slug} campaignName={campaignName} />;
    case "secret":
      return <SecretCrushTest slug={slug} campaignName={campaignName} />;
    case "personality":
      return <PersonalityTest slug={slug} campaignName={campaignName} />;
    case "comparison":
    default:
      return <ComparisonTest slug={slug} campaignName={campaignName} />;
  }
}
