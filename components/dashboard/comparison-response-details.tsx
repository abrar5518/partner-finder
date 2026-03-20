import type { CampaignResponseAnswers } from "@/lib/campaigns";

type ComparisonResponseDetailsProps = {
  answers: CampaignResponseAnswers;
  responseId: string;
};

function detailCard(label: string, value?: string | null) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-100">{value?.trim() || "N/A"}</p>
    </div>
  );
}

export function ComparisonResponseDetails({
  answers,
  responseId,
}: ComparisonResponseDetailsProps) {
  const reactionVideoPath = answers.reactionVideo?.path?.trim();
  const candidates = Array.isArray(answers.candidates) ? answers.candidates : [];
  const reactions = Array.isArray(answers.emotionalPull?.messageOrPresenceReaction)
    ? answers.emotionalPull?.messageOrPresenceReaction ?? []
    : [];
  const hasIdealData =
    Boolean(answers.warmup?.relationshipStyle) ||
    Boolean(answers.emotionalNeeds?.stressSupport) ||
    Boolean(answers.lifestyleCompatibility?.preferredLifestyle) ||
    Boolean(answers.attractionChemistry?.attractiveVibe) ||
    Boolean(answers.futureVision?.relationshipFuture) ||
    Boolean(answers.dreamPartnerSummary) ||
    Boolean(answers.nonNegotiableQuality);
  const hasSecretData =
    Boolean(answers.confidenceLevel) ||
    Boolean(answers.lifeContext) ||
    Boolean(answers.finalPick) ||
    Boolean(answers.overallPattern?.recentAttention) ||
    (Array.isArray(answers.suspects) && answers.suspects.length > 0);
  const hasPersonalityData =
    Boolean(answers.personalityProfile?.emotionalExpression) ||
    Boolean(answers.personalityArchetype) ||
    Boolean(answers.personalityScores?.romanticDreamer);

  if (hasIdealData) {
    return (
      <div className="space-y-5">
        {reactionVideoPath ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-100">Reaction video</p>
            <a
              href={reactionVideoPath}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-white underline underline-offset-4"
            >
              Open recorded video
            </a>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {detailCard("Relationship style", answers.warmup?.relationshipStyle)}
          {detailCard("Relationship priority", answers.warmup?.relationshipPriority)}
          {detailCard("Stress support", answers.emotionalNeeds?.stressSupport)}
          {detailCard("Communication style", answers.emotionalNeeds?.communicationStyle)}
          {detailCard("Love language", answers.emotionalNeeds?.loveLanguage)}
          {detailCard("Preferred lifestyle", answers.lifestyleCompatibility?.preferredLifestyle)}
          {detailCard("Attractive personality", answers.lifestyleCompatibility?.attractivePersonality)}
          {detailCard(
            "Ambition level",
            answers.lifestyleCompatibility?.ambitionLevel
              ? `${answers.lifestyleCompatibility.ambitionLevel}/5`
              : "N/A",
          )}
          {detailCard("Attractive vibe", answers.attractionChemistry?.attractiveVibe)}
          {detailCard("First attraction", answers.attractionChemistry?.firstAttraction)}
          {detailCard("Future relationship", answers.futureVision?.relationshipFuture)}
          {detailCard("Top value", answers.futureVision?.topValue)}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {detailCard("Dream partner summary", answers.dreamPartnerSummary)}
          {detailCard("Non-negotiable quality", answers.nonNegotiableQuality)}
        </div>
      </div>
    );
  }

  if (hasSecretData) {
    const suspects = Array.isArray(answers.suspects) ? answers.suspects : [];

    return (
      <div className="space-y-5">
        {reactionVideoPath ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-100">Reaction video</p>
            <a
              href={reactionVideoPath}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-white underline underline-offset-4"
            >
              Open recorded video
            </a>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {detailCard("Confidence level", answers.confidenceLevel)}
          {detailCard("Life context", answers.lifeContext)}
          {detailCard("Recent attention", answers.overallPattern?.recentAttention)}
          {detailCard("First suspicion trigger", answers.overallPattern?.firstSuspicionTrigger)}
          {detailCard("Friends hint", answers.overallPattern?.friendsHint)}
          {detailCard("Private vs public", answers.overallPattern?.privateVsPublic)}
          {detailCard("Special gesture level", answers.overallPattern?.specialGestureLevel)}
          {detailCard("Special gesture text", answers.overallPattern?.specialGestureText)}
          {detailCard("Overthinking check", answers.overallPattern?.overthinkingCheck)}
          {detailCard("Confession without words", answers.overallPattern?.confessionWithoutWords)}
          {detailCard("Final pick", answers.finalPick)}
        </div>

        <div className="grid gap-4">
          {suspects.map((suspect, suspectIndex) => (
            <div
              key={`${responseId}-${suspect.name || suspectIndex}`}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {suspect.name || `Suspect ${suspectIndex + 1}`}
                </h3>
                <p className="text-sm text-slate-400">
                  Gut score:{" "}
                  <span className="font-medium text-slate-100">
                    {suspect.gutScore ?? "N/A"}/5
                  </span>
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {detailCard("Relation type", suspect.relationType)}
                {detailCard("Sign frequency", suspect.signFrequency)}
                {detailCard("Expression context", suspect.expressionContext)}
                {detailCard("Reaction to others", suspect.reactionToOthers)}
                {detailCard("Absence response", suspect.absenceResponse)}
                {detailCard("Reason text", suspect.reasonText)}
                {detailCard("Signs", (suspect.signs || []).join(", "))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasPersonalityData) {
    return (
      <div className="space-y-5">
        {reactionVideoPath ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-100">Reaction video</p>
            <a
              href={reactionVideoPath}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-white underline underline-offset-4"
            >
              Open recorded video
            </a>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {detailCard("Emotional expression", answers.personalityProfile?.emotionalExpression)}
          {detailCard("Relationship fear", answers.personalityProfile?.relationshipFear)}
          {detailCard("Love meaning", answers.personalityProfile?.loveMeaning)}
          {detailCard("Ideal date energy", answers.personalityProfile?.idealDateEnergy)}
          {detailCard("When hurt need", answers.personalityProfile?.whenHurtNeed)}
          {detailCard("First attraction", answers.personalityProfile?.firstAttraction)}
          {detailCard("Natural love style", answers.personalityProfile?.naturalLoveStyle)}
          {detailCard("Long-term value", answers.personalityProfile?.longTermValue)}
          {detailCard("Personality archetype", answers.personalityArchetype)}
          {detailCard(
            "Romantic Dreamer score",
            answers.personalityScores?.romanticDreamer !== undefined
              ? String(answers.personalityScores.romanticDreamer)
              : "N/A",
          )}
          {detailCard(
            "Loyal Protector score",
            answers.personalityScores?.loyalProtector !== undefined
              ? String(answers.personalityScores.loyalProtector)
              : "N/A",
          )}
          {detailCard(
            "Independent Spirit score",
            answers.personalityScores?.independentSpirit !== undefined
              ? String(answers.personalityScores.independentSpirit)
              : "N/A",
          )}
          {detailCard(
            "Deep Soulmate score",
            answers.personalityScores?.deepSoulmate !== undefined
              ? String(answers.personalityScores.deepSoulmate)
              : "N/A",
          )}
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    const legacyPeople = Array.isArray(answers.people) ? answers.people : [];

    return (
      <div className="grid gap-4">
        {legacyPeople.map((person, personIndex) => (
          <div
            key={`${responseId}-${person.name || personIndex}`}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-semibold text-white">
                {person.name || `Person ${personIndex + 1}`}
              </h3>
              <p className="text-sm text-slate-400">
                Attraction Level:{" "}
                <span className="font-medium text-slate-100">
                  {person.attractionLevel ?? "N/A"}/10
                </span>
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {detailCard("Age", person.age ? String(person.age) : "N/A")}
              {detailCard("Traits", (person.traits || []).join(", "))}
              {detailCard("Weaknesses", (person.weaknesses || []).join(", "))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reactionVideoPath ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-100">Reaction video</p>
          <a
            href={reactionVideoPath}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-sm font-medium text-white underline underline-offset-4"
          >
            Open recorded video
          </a>
        </div>
      ) : null}
      <div className="grid gap-4">
        {candidates.map((candidate, candidateIndex) => {
          const reaction = reactions.find((item) => item.candidateName === candidate.name);

          return (
            <div
              key={`${responseId}-${candidate.name || candidateIndex}`}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {candidate.name || `Person ${candidateIndex + 1}`}
                </h3>
                <p className="text-sm text-slate-400">
                  Emotional pull:{" "}
                  <span className="font-medium text-slate-100">
                    {reaction?.score ?? "N/A"}/5
                  </span>
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {detailCard("How they know them", candidate.howYouKnowThem)}
                {detailCard("Known for", candidate.knownDuration)}
                {detailCard("Current relationship", candidate.currentRelationship)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {detailCard("Future vision", answers.emotionalPull?.futureVision)}
        {detailCard("Emotional understanding", answers.emotionalPull?.emotionalUnderstanding)}
        {detailCard("Jealousy reaction", answers.emotionalPull?.jealousyReaction)}
        {detailCard("Supports goals", answers.compatibility?.supportGoals)}
        {detailCard("True self comfort", answers.compatibility?.trueSelf)}
        {detailCard("Talk after hard day", answers.compatibility?.difficultDay)}
        {detailCard("Trust with secrets", answers.compatibility?.trustSecrets)}
        {detailCard("Physical attraction", answers.attraction?.physicalAttraction)}
        {detailCard("Holding hands image", answers.attraction?.holdingHands)}
        {detailCard("Happiest confession", answers.attraction?.happiestConfession)}
        {detailCard("Intuition choice", answers.intuitionChoice)}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {detailCard("Realization moment", answers.reflections?.realizationMoment)}
        {detailCard("Soft heart reason", answers.reflections?.softHeartThing)}
      </div>
    </div>
  );
}
