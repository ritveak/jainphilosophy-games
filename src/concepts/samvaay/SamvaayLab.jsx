import LabEmbedded from '../../components/lab/LabEmbedded';
import PivotImmersive from '../../components/lab/PivotImmersive';
import { LAB_TITLES } from './data';
import { useSamvaayLab } from './useSamvaayLab';
import ScenarioPicker from './lab/ScenarioPicker';
import StepJourney from './lab/StepJourney';
import PivotScreen from './lab/PivotScreen';
import RevealEngine from './lab/RevealEngine';
import ResultScorecard from './lab/ResultScorecard';

export default function SamvaayLab() {
  const lab = useSamvaayLab();
  const { state } = lab;

  const title =
    state.labStage === 'step'
      ? LAB_TITLES.step(state.progressStep)
      : LAB_TITLES[state.labStage] || 'The Laboratory';

  return (
    <>
      <LabEmbedded title={title}>
        {state.labStage === 'scenarios' && (
          <ScenarioPicker
            scenarios={state.scenarios}
            selectedId={state.scenario?.id}
            onSelect={lab.startScenario}
          />
        )}

        {state.labStage === 'step' && state.scenario && (
          <StepJourney
            step={state.progressStep}
            scenario={state.scenario}
            answers={state.answers}
            onGoToStep={(target) => lab.goToStep(target, state.progressStep)}
            onStepBack={lab.stepBack}
            onAdvance={lab.advanceFromStep}
            onSelectUpadana={lab.selectUpadana}
            onSelectKala={lab.selectKala}
            onIncrementEffort={lab.incrementEffort}
          />
        )}

        {state.labStage === 'reveal' && (
          <RevealEngine
            revealQueue={state.revealQueue}
            revealIndex={state.revealIndex}
            onTick={lab.advanceReveal}
            onShowResult={lab.showResult}
          />
        )}

        {state.labStage === 'result' && state.scenario && (
          <ResultScorecard
            scenario={state.scenario}
            answers={state.answers}
            roll={state.roll}
            posture={state.posture}
            externalSuccess={state.externalSuccess}
            internalSuccess={state.internalSuccess}
            finalMatrix={state.finalMatrix}
            onTryAgain={lab.tryAgain}
            onChooseOther={lab.chooseOther}
            onReset={lab.resetToScenarios}
          />
        )}
      </LabEmbedded>

      <PivotImmersive active={state.labStage === 'pivot'}>
        <PivotScreen
          onSelectReactive={() => lab.selectPosture('Reactive Loop')}
          onSelectKnower={() => lab.selectPosture('Knower-Seer')}
          onBack={lab.pivotBack}
        />
      </PivotImmersive>
    </>
  );
}
