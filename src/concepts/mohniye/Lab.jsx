import LabEmbedded from '../../components/lab/LabEmbedded';
import { LAB_TITLES } from './data';
import { useMohniyeLab } from './useMohniyeLab';
import ScenarioPicker from './lab/ScenarioPicker';
import DecisionScreen from './lab/DecisionScreen';
import RevealEngine from './lab/RevealEngine';
import ResultScorecard from './lab/ResultScorecard';

export default function Lab() {
  const lab = useMohniyeLab();
  const { state } = lab;

  const title = state.labStage === 'step' ? LAB_TITLES.step(state.progressStep) : LAB_TITLES[state.labStage] || 'Mohniye Lab';

  return (
    <LabEmbedded title={title}>
      {state.labStage === 'intro' && (
        <div>
          <p className="text-stone-700 leading-7">Discover how your mind slowly convinces you that only one option exists.</p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => lab.goTo('rules')} className="rounded-full bg-amber-300 px-5 py-2">Begin</button>
          </div>
        </div>
      )}

      {state.labStage === 'rules' && (
        <div>
          <p className="mt-3 text-stone-600">In real life we often instinctively think of an option, and if we actively think more, then more options become visible. </p>
          <br/>
            <p>Likewise in our lab, one response is initially visible.<br/> Pressing on the <span className="font-semibold">"Think harder to come up with more options"</span> button is in an indicative way of actively thinking for more options, after some clicks more options become visible. 
            <br/><br/>Since IRL, we do not take forever to respond, we have a timer which auto-submits the current selection.</p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => lab.goTo('scenarios')} className="rounded-full bg-emerald-600 px-5 py-2 text-white">Continue</button>
          </div>
        </div>
      )}

      {state.labStage === 'scenarios' && (
        <ScenarioPicker scenarios={state.scenarios} selectedId={state.scenario?.id} onSelect={lab.startScenario} />
      )}

      {state.labStage === 'step' && state.scenario && (
        <DecisionScreen
          step={state.progressStep}
          scenario={state.scenario}
          reflections={state.reflections}
          selections={state.selections}
          onIncrementReflection={lab.incrementReflection}
          onSelectLevel={lab.selectLevel}
          onSubmitStep={lab.submitStep}
        />
      )}

      {state.labStage === 'reveal' && (
        <RevealEngine revealQueue={state.revealQueue} revealIndex={state.revealIndex} onTick={lab.advanceReveal} onShowResult={lab.showResult} />
      )}

      {state.labStage === 'result' && (
        <ResultScorecard scenario={state.scenario} reflections={state.reflections} selections={state.selections} meta={state.finalMeta} onTryAgain={lab.tryAgain} onReset={lab.reset} />
      )}
    </LabEmbedded>
  );
}
