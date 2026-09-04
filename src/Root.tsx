import { AbsoluteFill, Composition } from "remotion";
import { Scene1_GlobeToVirginia as ChildcareOne } from "./videos/paying for Childcare in 2026 Looks Like This/one";
import { Scene2_LittletonColorado as ChildcareTwo } from "./videos/paying for Childcare in 2026 Looks Like This/two";
import ChildcareThree from "./videos/paying for Childcare in 2026 Looks Like This/three";
import { Scene4_IowaDesMoines as ChildcareFour } from "./videos/paying for Childcare in 2026 Looks Like This/four";
import ChildcareFive from "./videos/paying for Childcare in 2026 Looks Like This/five";
import  ChildcareSix from "./videos/paying for Childcare in 2026 Looks Like This/six";
import  ChildcareSeven from "./videos/paying for Childcare in 2026 Looks Like This/seven";
import  ChildcareEight from "./videos/paying for Childcare in 2026 Looks Like This/eight";
import  ChildcareNine  from "./videos/paying for Childcare in 2026 Looks Like This/nine";
import  ChildcareTen  from "./videos/paying for Childcare in 2026 Looks Like This/ten";
import  ChildcareEleven  from "./videos/paying for Childcare in 2026 Looks Like This/eleven";
import  ChildcareTwelve  from "./videos/paying for Childcare in 2026 Looks Like This/twelve";
import  ChildcareThirteen  from "./videos/paying for Childcare in 2026 Looks Like This/thirteen";
import  ChildcareFourteen  from "./videos/paying for Childcare in 2026 Looks Like This/fourteen";
import  ChildcareFifteen  from "./videos/paying for Childcare in 2026 Looks Like This/fifteen";
import  ChildcareSixteen  from "./videos/paying for Childcare in 2026 Looks Like This/sixteen";
import  ChildcareSeventeen  from "./videos/paying for Childcare in 2026 Looks Like This/seventeen";
import { Scene18 as ChildcareEighteen } from "./videos/paying for Childcare in 2026 Looks Like This/eighteen";
import { Scene19 as ChildcareNineteen } from "./videos/paying for Childcare in 2026 Looks Like This/nineteen";
import { Scene20 as ChildcareTwenty } from "./videos/paying for Childcare in 2026 Looks Like This/twenty";
import { Scene21 as ChildcareTwentyOne } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-one";
import { Scene22 as ChildcareTwentyTwo } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-two";
import { Scene23 as ChildcareTwentyThree } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-three";
import { Scene24 as ChildcareTwentyFour } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-four";
import { Scene25 as ChildcareTwentyFive } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-five";
import { Scene26 as ChildcareTwentySix } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-six";
import { Scene27 as ChildcareTwentySeven } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-seven";
import { Scene28 as ChildcareTwentyEight } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-eight";
import { Scene29 as ChildcareTwentyNine } from "./videos/paying for Childcare in 2026 Looks Like This/twenty-nine";
import { Scene30 as ChildcareThirty } from "./videos/paying for Childcare in 2026 Looks Like This/thirty";

const DURATION = 1000;
const FPS = 30;
const WIDTH = 3840;
const HEIGHT = 2160;

const BlackScreen = () => {
	return <AbsoluteFill style={{ backgroundColor: "#000000" }} />;
};

export const RemotionRoot = () => {
	return (
		<>
			<Composition
				id="BlackScreen"
				component={BlackScreen}
				durationInFrames={DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			<Composition id="RM-CHILDCARE-1" component={ChildcareOne} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-2" component={ChildcareTwo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-3" component={ChildcareThree} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-4" component={ChildcareFour} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-5" component={ChildcareFive} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-6" component={ChildcareSix} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-7" component={ChildcareSeven} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-8" component={ChildcareEight} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-9" component={ChildcareNine} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-10" component={ChildcareTen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-11" component={ChildcareEleven} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-12" component={ChildcareTwelve} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-13" component={ChildcareThirteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-14" component={ChildcareFourteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-15" component={ChildcareFifteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-16" component={ChildcareSixteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-17" component={ChildcareSeventeen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-18" component={ChildcareEighteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-19" component={ChildcareNineteen} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-20" component={ChildcareTwenty} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-21" component={ChildcareTwentyOne} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-22" component={ChildcareTwentyTwo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-23" component={ChildcareTwentyThree} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-24" component={ChildcareTwentyFour} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-25" component={ChildcareTwentyFive} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-26" component={ChildcareTwentySix} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-27" component={ChildcareTwentySeven} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-28" component={ChildcareTwentyEight} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-29" component={ChildcareTwentyNine} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
			<Composition id="RM-CHILDCARE-30" component={ChildcareThirty} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		</>
	);
};
