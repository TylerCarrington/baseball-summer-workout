import { Exercise, DayPlan, ProgramPhase } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // --- WARM UP ---
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'warmup',
    baseReps: '2 x 20 yds',
    phaseSpecs: {
      1: '2 x 20 yds (rhythm and quick feet)',
      2: '2 x 20 yds (drive knees to hip height)',
      3: '2 x 20 yds (rapid pace, pump arms)',
      4: '2 x 15 yds (smooth speed, focus on warming up)'
    },
    description: 'Run forward driving your knees up to hip height, pumping your arms with elbow angles at 90 degrees.',
    cues: ['Stay tall, don\'t lean back', 'Land soft on your midfoot', 'Keep a fast, springy rhythm'],
    visualType: 'warmup',
    videoLink: 'https://www.youtube.com/embed/ZNDHivUg7vA?si=5hZ2rtSZ12Gncs-g'
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'warmup',
    baseReps: '2 x 20 yds',
    phaseSpecs: {
      1: '2 x 20 yds (smooth rate)',
      2: '2 x 20 yds (faster frequency)',
      3: '2 x 20 yds (high hamstring recruitment)',
      4: '2 x 15 yds (rhythmical recovery)'
    },
    description: 'Jog forward while rapidly bringing your heels up to touch your glutes with each step, keeping thighs vertical.',
    cues: ['Keep your knees pointing down', 'Pump your arms', 'Fast feet, minimal ground contact time'],
    visualType: 'warmup',
    videoLink: 'https://www.youtube.com/embed/lVZi-AwxLPo?si=1FXHufMuN5zFzj2i'
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge with Overhead Reach',
    category: 'warmup',
    baseReps: '8 each leg',
    phaseSpecs: {
      1: '8 each leg (focus on balanced posture)',
      2: '8 each leg (deepen the hip stretch)',
      3: '10 each leg (control lateral stabilizer wobble)',
      4: '6 each leg (perfect lunging form)'
    },
    description: 'Step forward into a split stance, lower hips until rear knee nearly touches the floor while stretching both arms straight up to the sky.',
    cues: ['Keep front heel glued to the floor', 'Reach high to stretch the front of your rear hip', 'Push straight up out of the bottom'],
    visualType: 'lunge',
    videoLink: 'https://www.youtube.com/embed/DmbJ1-tKnLQ?si=6eEVFSemcoAfTA7y'
  },
  {
    id: 'lateral-shuffle',
    name: 'Lateral Shuffle',
    category: 'warmup',
    baseReps: '2 x 20 yds each direction',
    phaseSpecs: {
      1: '2 x 20 yds (stay wide and low)',
      2: '2 x 20 yds (increase speed, stay low)',
      3: '2 x 20 yds (emphasize rapid push-off)',
      4: '1 x 15 yds each (smooth side-shuffling)'
    },
    description: 'Push off your trailing leg to slide sideways without crossing your feet. Keep a athletic wide, low stance.',
    cues: ['Stay low like a shortstop', 'Do not cross your feet or click your heels', 'Push through the floor, don\'t hop'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/iBmvPEWt5og?si=SYgXn-N1L10-jLfU'
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    category: 'warmup',
    baseReps: '10 small, 10 large (forward/back)',
    phaseSpecs: {
      1: '10 small, 10 large (forward + back, controlled)',
      2: '10 small, 12 large (focus on shoulder-blade squeeze)',
      3: '12 small, 12 large (controlled rapid rhythm)',
      4: '8 small, 8 large (restorative, light movement)'
    },
    description: 'Stand with feet shoulder-width apart, arms out to sides. Make circles, building from golf-ball size to beach-ball size, then repeat in backward direction.',
    cues: ['Stand tall with ears over shoulders', 'Keep shoulders relaxed down, not up in ears', 'Squeeze your shoulder blades behind you'],
    visualType: 'warmup',
    videoLink: 'https://www.youtube.com/embed/UVMEnIaY8aU?si=UWg3-MSVoCSkM8fv'
  },
  {
    id: 'inchworm-walkouts',
    name: 'Inchworm Walkouts',
    category: 'warmup',
    baseReps: '5 reps',
    phaseSpecs: {
      1: '5 reps (stretch hamstrings nicely)',
      2: '6 reps (hold full plank 2 seconds)',
      3: '6-8 reps (add a small plank-jack at bottom)',
      4: '4 reps (smooth hamstring decompression)'
    },
    description: 'Bent at hips to touch floor. Walk hand out into a perfect high plank, hold for a moment, then baby-step feet back up to meet your hands.',
    cues: ['Keep knees as straight as comfortably possible', 'Squeeze your glutes in the plank', 'Walk your hands, don\'t sag your hips'],
    visualType: 'warmup',
    videoLink: 'https://www.youtube.com/embed/ZY2ji_Ho0dA?si=7PIdyg_5axLgHImp'
  },

  // --- MOVEMENT / AGILITY ---
  {
    id: 'cone-shuttle',
    name: 'Cone Shuttle Sprint (5-10-5)',
    category: 'agility',
    baseReps: '2-3 rounds',
    phaseSpecs: {
      1: '2 runs (focus on clean change of direction)',
      2: '3 runs (explosive acceleration from turn)',
      3: '3 runs (compete against stopwatch, low center of mass)',
      4: '2 runs (focus on visual target, 80% speed)'
    },
    description: 'Start at center cone. Sprint 5 yards right, touch line/cone, speed change to sprint 10 yards left, touch line/cone, sprint 5 yards back to center.',
    cues: ['Keep hips low when turning around', 'Sink weight on inside leg when transitioning', 'Accelerate through the center line'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/67-Bbh92p-4?si=0_l2sb6i2JiJqe1S'
  },
  {
    id: 'bear-crawl',
    name: 'Bear Crawl',
    category: 'agility',
    baseReps: '15-20 yds',
    phaseSpecs: {
      1: '15 yds Bear Crawl',
      2: '20 yds Bear Crawl',
      3: '20 yds backward Bear Crawl',
      4: '10 yds Bear Crawl (slow and steady control)'
    },
    description: 'Crawling forward on hands and toes with knees close to floor but not touching.',
    cues: ['Squeeze abs, look 1 foot in front of hands', 'Keep knees an inch off the ground', 'Move opposite arm and opposite leg together'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/t8XLor7unqU?si=ThExqx35dAl27zLi&start=6'
  },
  {
    id: 'crab-walk',
    name: 'Crab Walk',
    category: 'agility',
    baseReps: '15-20 yds',
    phaseSpecs: {
      1: '15 yds Crab Walk',
      2: '20 yds Crab Walk (low hips)',
      3: '20 yds forward Crab Walk',
      4: '10 yds Crab Walk (slow and steady control)'
    },
    description: 'Crawling backwards on hands/feet with hips raised and chin tucked.',
    cues: ['Squeeze shoulders together, push ground away', 'Keep hips elevated', 'Move opposite arm and opposite leg together'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/I-3r4cl4ahA?si=YvtPLbZY3apyET8K&start=6'
  },
  {
    id: 'pogo-hops',
    name: 'Pogo Hops',
    category: 'agility',
    baseReps: '2 x 10 hops',
    phaseSpecs: {
      1: '2 x 10 hops (soft, quiet landings)',
      2: '2 x 12 hops (stay springy on toes)',
      3: '3 x 10 hops (maximize height, stiff ankles)',
      4: '2 x 8 hops (low volume, light, bouncy)'
    },
    description: 'Bounce up and down on the balls of your feet with stiff legs, using primarily your calves and ankles to spring upward. Land quietly like an athlete.',
    cues: ['Ankles are like steel springs', 'Legs are mostly straight, soft knee bend', 'Listen to your feet: make NO sound on landing'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/A7m_4Vyp0bU?si=6Ox5lUDxjRWjPuoM'
  },
  {
    id: 'broad-jump',
    name: 'Standing Broad Jump',
    category: 'agility',
    baseReps: '4-5 reps',
    phaseSpecs: {
      1: '4 reps (focus on stable landing, count to 2 on catch)',
      2: '5 reps (emphasize hip extension and arm swing)',
      3: '5 reps (maximal jump, absolute stick landings)',
      4: '3 reps (soft technical execution)'
    },
    description: 'Stand tall, swing arms back while bending hips and knees. Explode your hips open and swing arms forward to jump for distance, sticking the landing.',
    cues: ['Load your hips like a spring', 'Throw your arms forward to power the jump', 'Land soft on flat feet: "stick" the landing without taking extra steps'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/uhz-ia-2UcM?si=-7pWFLvw7c8Jha7y'
  },
  {
    id: 'line-hops',
    name: 'Quick-Feet Line Hops',
    category: 'agility',
    baseReps: '3 x 15 sec',
    phaseSpecs: {
      1: '3 x 15 sec (forward/backward over line)',
      2: '3 x 15 sec (lateral side-to-side over line)',
      3: '3 x 15 sec (single-leg hops - 10 sec per leg)',
      4: '2 x 15 sec (smooth, rhythmical footwork)'
    },
    description: 'Find a line on the ground. Hop back-and-forth or side-to-side over the line as fast as possible keeping chest stable.',
    cues: ['Feet stay close together', 'Stay light on the balls of your feet', 'Minimize knee bend, use quick ankle springs'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/S8tFqJwFYnM?si=pLjikn56XhN7Dtyu'
  },
  {
    id: 'box-jump',
    name: 'Low Box Jump with Soft Landing',
    category: 'agility',
    baseReps: '5 reps (Weeks 6+ only)',
    phaseSpecs: {
      1: 'Skip (not programmed in Phase 1)',
      2: 'Skip (not programmed in Phase 2)',
      3: '5 reps on 6-12" step/box (focus on deep catch & control)',
      4: 'Skip (safe taper in Week 8)'
    },
    description: 'Jump from the ground onto a low stable box or aerobic step (6-12 inches). Explode up and absorb the force by landing in a partial squat position.',
    cues: ['Land like a ninja: completely silent', 'Stand up tall at the top to finish the rep', 'Step down carefully, never jump down backwards'],
    visualType: 'agility',
    videoLink: 'https://www.youtube.com/embed/eQqwXl44zNE?si=E-FRf8vksZ5JeDmr'
  },

  // --- STRENGTH CIRCUIT ---
  {
    id: 'squat',
    name: 'Squat (Bodyweight to Goblet)',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '8-10 reps (Bodyweight only, check depth)',
      2: '10-12 reps (Light Goblet Hold, using med ball/water jug)',
      3: '12-15 reps (Goblet Hold, slow descent 3-sec down)',
      4: '8-10 reps (Bodyweight only, speed on way up)'
    },
    description: 'Stand with feet slightly wider than shoulders. Sit back and down as if lowering into a chair. Keep chest up and knees tracking in line with toes.',
    cues: ['Drive your knees out, don\'t let them buckle', 'Keep your whole foot flat: heels glued down', 'Keep chest tall, eyes straight forward'],
    visualType: 'squat',
    videoLink: 'https://www.youtube.com/embed/pEGfGwp6IEA?si=17h3eEi9pS7HRQst'
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '5-8 reps (Flat or on incline/couch if flat is too hard)',
      2: '8-10 reps (Flawless plank line, chest to floor)',
      3: '10-12 reps (Slow 3-sec negative on way down)',
      4: '6-8 reps (Bodyweight standard, explosive push!)'
    },
    description: 'Start in a secure high plank. Keeping elbows at 45 degrees, lower your body as a single unit until chest is 2 inches off the ground, then push away.',
    cues: ['Don\'t lift or drop your chin: neck is straight', 'Squeeze your glutes and pull belly button to spine', 'Body stays straight like a steel broomstick'],
    visualType: 'pushup',
    videoLink: 'https://www.youtube.com/embed/WDIpL0pjun0?si=vOvd8Z1m0kQxQDXE'
  },
  {
    id: 'band-row',
    name: 'Band Row / Towel Row',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '10 reps (Hold band with light tension)',
      2: '12 reps (Increase tension, squeeze blades for 1 sec)',
      3: '12-15 reps (Maximum resistance, 2-sec hold at chest)',
      4: '10 reps (Focus on perfect posture rows)'
    },
    description: 'Anchor resistance band at chest height. Hold handles, step back to create tension. Pull elbows back, squeezing shoulder blades together.',
    cues: ['Pull with your back, not just your hands', 'Keep shoulders down, away from your ears', 'Stand tall, don\'t lean backward or forward'],
    visualType: 'row',
    videoLink: 'https://www.youtube.com/embed/JP2xq33lNF0?si=XNq9fBvAD2Xtf-3n'
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge to Single-Leg',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '10 reps (2-Leg Bridge, squeeze glutes at the top)',
      2: '8 reps/leg (Single-Leg Bridge, keep pelvic level flat)',
      3: '10 reps/leg (Single-Leg Bridge with knee hug to chest)',
      4: '8 reps/leg (2-Leg or Single-Leg, focus on peak hold)'
    },
    description: 'Lie on your back with knees bent, feet flat. Drive hips towards the sky by squeezing glutes. Transition to lifting one foot off the ground for Single-Leg version.',
    cues: ['Drive through your heels, not your toes', 'Squeeze glutes at the top like holding a coin', 'Do not arch your lower back too much'],
    visualType: 'bridge',
    videoLink: 'https://www.youtube.com/embed/AVAXhy6pl7o?si=az7-uiFHylFBA5KZ'
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '6 reps/leg (Reverse Lunge only, step straight back)',
      2: '8 reps/leg (Reverse Lunge, steady speed)',
      3: '8 reps/leg (Reverse Lunge, deep stretch and power up)',
      4: '6 reps/leg (Reverse Lunge, smooth bodyweight movement)'
    },
    description: 'Stand tall. Step one foot straight back, lowering your back knee near the ground.',
    cues: ['Keep your front knee directly over your ankle', 'Push off the front heel to stand up', 'Keep your chest tall'],
    visualType: 'lunge',
    videoLink: 'https://www.youtube.com/embed/xrPteyQLGAo?si=NTT94T00UEXmK7Zz'
  },
  {
    id: 'farmers-carry',
    name: 'Farmer\'s Carry',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '20 yds (Carry light water bottles or dumbbells nicely)',
      2: '30 yds (Heavy grip, chest proud, step heel-to-toe)',
      3: '40 yds (Increase weight, focus on zero sway)',
      4: '20 yds (Moderate weight, posture emphasis)'
    },
    description: 'Hold dumbbells or heavy water jugs in each hand. Stand tall with perfect posture and walk slow, controlled heel-to-toe steps.',
    cues: ['Imagine a book resting on your head', 'Shoulders down and back, don\'t shrug', 'Squeeze dumbbells hard to build throwing grip strength'],
    visualType: 'carry',
    videoLink: 'https://www.youtube.com/embed/8OtwXwrJizk?si=9ZSwnkn-rJ0VcAqk'
  },
  {
    id: 'balance-reach',
    name: 'Single-Leg Balance Reach',
    category: 'strength',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '15 sec/leg (Stand on one leg, hover other foot)',
      2: '20 sec/leg (Reach hover foot forward, side, and back)',
      3: '20 sec/leg plus RDL reach (hinge hips back like a drinking bird)',
      4: '15 sec/leg (Perfect balance, eyes closed if feeling advanced!)'
    },
    description: 'Balance on one leg with soft knee. Carefully reach your other leg forward, sideways, and backward without touching the ground, then return to center.',
    cues: ['Pick a spot on the wall to look at', 'Squeeze the glute of the active stance leg', 'Keep your hips level, don\'t tilt side-to-side'],
    visualType: 'balance',
    videoLink: 'https://www.youtube.com/embed/5au30Xk6Gkk?si=TWeUR0AAfIVTKYZf'
  },

  // --- CORE & ROTATOR ---
  {
    id: 'front-plank',
    name: 'Front Plank',
    category: 'core',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '15-20 sec hold (Flawless alignment)',
      2: '20-30 sec hold (Strong hollow-body hold)',
      3: '30-40 sec hold (Imagine pulling elbows to toes)',
      4: '20 sec hold (High tension focus)'
    },
    description: 'Support your weight on your forearms and toes. Keep your body in a straight line with abdominal muscles locked tight.',
    cues: ['Squeeze your butt tight', 'Push your elbows into the ground to dome your upper back', 'Don\'t let your hips sag down, keep them level'],
    visualType: 'core',
    videoLink: 'https://www.youtube.com/embed/pvIjsG5Svck?si=mGJeQxfJWofzZZNA'
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '10-15 sec/side (From knees if full is too hard)',
      2: '15-20 sec/side (Standard full side plank)',
      3: '20-25 sec/side (With slow arm reach to the sky)',
      4: '15 sec/side (Active side-body control)'
    },
    description: 'Lie on your side, propped on forearm. Stack your feet or knees, lift your hips off the ground to make a straight line.',
    cues: ['Keep your shoulder directly over elbow', 'Squeeze the bottom rib up high', 'Keep head in line with spine, don\'t tuck chin'],
    visualType: 'core',
    videoLink: 'https://www.youtube.com/embed/N_s9em1xTqU?si=E0gM82FTyqhEAnrX'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '6/side (Slow and steady overhead movement)',
      2: '8/side (Press opposite hand into knee for high tension)',
      3: '8/side (Add holding a med ball on knees)',
      4: '6/side (Decompress lower spine, perfect ribs-down)'
    },
    description: 'Lie on back, arms pointing up, knees/hips bent 90 degrees. Lower right arm overhead and left leg straight out toward floor. Return, swap sides.',
    cues: ['Glue your lower back to the floor: leave NO space', 'Breathe out hard as you extend your leg', 'Go slow: slower is harder and better'],
    visualType: 'core',
    videoLink: 'https://www.youtube.com/embed/o4GKiEoYClI?si=e9jvzZ2Mj2hcP-rz'
  },
  {
    id: 'medball-throw',
    name: 'Standing Rotational Med Ball Throw',
    category: 'core',
    baseReps: 'Progression by Phase',
    phaseSpecs: {
      1: '5 each side (Light 2-3lb ball, focus on posture twist)',
      2: '6 each side (Increase twist velocity, step into it)',
      3: '8-10 each side (Throw as hard as possible, catch on rebound)',
      4: '5 each side (Perfect speed of hip-to-shoulder rotation)'
    },
    description: 'Stand sideways to solid wall holding med ball at chest. Hinge into back hip, shift weight forward and throw the ball rotationally against wall, catching bounce.',
    cues: ['Load your back leg like a pitcher on the mound', 'Lead with your hips, then let chest follow', 'Throw from your core, keep arms stable'],
    visualType: 'core'
  },

  // --- COOL DOWN ---
  {
    id: 'stretches',
    name: 'Full Cool-Down Stretch Circuit',
    category: 'cooldown',
    baseReps: '1 round of holds',
    phaseSpecs: {
      1: '20 sec holds for Hamstring, Quad, Calf, Chest/Shoulder',
      2: '30 sec holds (Deep breathing recovery)',
      3: '30 sec holds (Focus on chest/shoulder sleeper release)',
      4: '20 sec holds (General tension recovery)'
    },
    description: 'A relaxing sequence of static stretches: 1. Sitting hamstring reach, 2. Standing quad stretch, 3. Calf wall stretch, and 4. Doorway chest opener stretch.',
    cues: ['Inhale deep through your nose, exhale slow out your mouth', 'Never bounce in stretches; hold a comfortable tension', 'Relax your neck and jaw completely'],
    visualType: 'stretch'
  },
  {
    id: 'arm-care-1',
    name: 'Band External Rotation',
    category: 'warmup',
    baseReps: '2 sets x 10 reps',
    phaseSpecs: {
      1: '2 sets x 10 reps',
      2: '2 sets x 10 reps',
      3: '2 sets x 10 reps',
      4: '2 sets x 10 reps'
    },
    description: 'Elbow pinned to your side at 90 degrees. Hold band, pull hand outward away from your stomach, keeping elbow tight.',
    cues: ['Place a rolled-up towel between elbow and ribs to keep form perfect'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/dLSytuFOCX8?si=PKEFtjHiDRpLfs6L'
  },
  {
    id: 'arm-care-2',
    name: 'Band Internal Rotation',
    category: 'warmup',
    baseReps: '2 sets x 10 reps',
    phaseSpecs: {
      1: '2 sets x 10 reps',
      2: '2 sets x 10 reps',
      3: '2 sets x 10 reps',
      4: '2 sets x 10 reps'
    },
    description: 'Elbow pinned to side at 90 degrees. Hold band, pull hand inward across your stomach, keeping your shoulder stable.',
    cues: ['Keep wrist straight; move only from the rotator cuff'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/7bXPgfGzW9k?si=ykiVpcAQjk__FXoo'
  },
  {
    id: 'arm-care-3',
    name: 'Cross-Body / Sleeper Stretch',
    category: 'warmup',
    baseReps: '2 sets x 20 sec',
    phaseSpecs: {
      1: '2 sets x 20 sec per side',
      2: '2 sets x 20 sec per side',
      3: '2 sets x 20 sec per side',
      4: '2 sets x 20 sec per side'
    },
    description: 'Lie on side, arm at 90 degrees out from shoulder. Carefully press your wrist down toward the floor using opposite hand.',
    cues: ['Go strictly to comfortable stretch; NEVER push into pinching pain'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/a_Z9WhGyKkE?si=wPReIIIPQXQ1GDes&start=10'
  },
  {
    id: 'arm-care-4',
    name: '90/90 Hip Switches',
    category: 'warmup',
    baseReps: '8-10 reps side to side',
    phaseSpecs: {
      1: '8-10 reps side to side',
      2: '8-10 reps side to side',
      3: '8-10 reps side to side',
      4: '8-10 reps side to side'
    },
    description: 'Sit on ground with knees bent at 90 degrees in front/side. Without lifting hands if possible, rotate hips side to side to change knee direction.',
    cues: ['Unlocks hip internal rotation key to generating force from the legs'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/m51AZSXMvEA?si=ElLdbQAv8pRsqSc0'
  },
  {
    id: 'arm-care-5',
    name: 'Quadruped "Open the Gate" Rotations',
    category: 'warmup',
    baseReps: '8 reps each side',
    phaseSpecs: {
      1: '8 reps each side',
      2: '8 reps each side',
      3: '8 reps each side',
      4: '8 reps each side'
    },
    description: 'On all fours, place hand behind head. Rotate elbow up to sky, opening your chest, then tuck elbow under towards opposite armpit.',
    cues: ['Follow your elbow with your eyes to get full upper back (T-Spine) stretch'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/XoFSl3i9Gns?si=vvdXLPFZKneEDxGK'
  },
  {
    id: 'arm-care-6',
    name: 'Y-T-W Raises',
    category: 'warmup',
    baseReps: '1 set of 8 reps each',
    phaseSpecs: {
      1: '1 set of 8 reps each letter',
      2: '1 set of 8 reps each letter',
      3: '1 set of 8 reps each letter',
      4: '1 set of 8 reps each letter'
    },
    description: 'Hinge forward at hips. Raise arms straight up at 45 degrees for Ys, straight sideways for Ts, and bent-elbow squeeze for Ws.',
    cues: ['Squeeze the muscles around your shoulder blades on every single rep'],
    visualType: 'warmup',
    videoLink: 'https://www.youtube.com/embed/QdGTI4Lshg4?si=4TAIeNT73rG6jyDv'
  },
  {
    id: 'day-a-step-2',
    name: 'Hit The Targets (30 - 45 ft)',
    category: 'strength',
    baseReps: '25-30 throws',
    phaseSpecs: {
      1: '25-30 throws (60% effort)',
      2: '25-30 throws (65% effort)',
      3: '25-30 throws (70% effort)',
      4: '25-30 throws (70% effort)'
    },
    description: 'Perform 25-30 controlled throws focused entirely on front glove-side direction and finding a consistent partner target. Have him follow through with hips square.',
    cues: ['Focus on consistent partner target', 'Follow through with hips square', 'Keep effort controlled (60-70%)']
  },
  {
    id: 'day-a-step-3',
    name: 'Mechanics Check',
    category: 'strength',
    baseReps: 'Continuous',
    phaseSpecs: {
      1: 'Focus on vertical release',
      2: 'Focus on vertical release',
      3: 'Focus on vertical release',
      4: 'Focus on vertical release'
    },
    description: 'During your throws, emphasize vertical release point, landing foot pointed straight at partner, and front collar glove tucked tightly to body.',
    cues: ['Vertical release point', 'Landing foot straight at partner', 'Front glove tucked to body']
  },
  {
    id: 'day-b-step-2',
    name: 'Progress Outwards (45 to 75 ft)',
    category: 'strength',
    baseReps: 'Step back every 5 throws',
    phaseSpecs: {
      1: 'Max 45 ft',
      2: 'Max 55 ft',
      3: 'Max 65 ft',
      4: 'Max 75 ft'
    },
    description: 'Gradually step back every 5 throws. Build distance in early weeks to roughly 75 ft by weeks 6-8. Use high, easy arches. Effort should feel smooth, NEVER max muscular contraction throws. Keep throws in the air; if they fall short, step closer!',
    cues: ['Step back every 5 throws', 'Use high, easy arches', 'Never use max effort', 'Step closer if bouncing']
  },
  {
    id: 'day-b-step-3',
    name: 'Step-In Recovery',
    category: 'cooldown',
    baseReps: '5 flips',
    phaseSpecs: {
      1: '20 ft taper down',
      2: '20 ft taper down',
      3: '20 ft taper down',
      4: '20 ft taper down'
    },
    description: 'Step back in to 20 ft for 5 easy wrist flips to taper down. Immediately finish with the posterior chest doorway stretch!',
    cues: ['Step in to 20 ft', '5 easy wrist flips', 'Follow up with stretches'],
    visualType: 'stretch',
    videoLink: 'https://www.youtube.com/embed/r6mv__re704?si=77NcRdHY7zmXEJO5'
  }
];

export const ARM_CARE_STEPS = [
  {
    name: 'Band External Rotation',
    reps: '2 sets x 10 reps',
    description: 'Elbow pinned to your side at 90 degrees. Hold band, pull hand outward away from your stomach, keeping elbow tight.',
    coachingCue: 'Place a rolled-up towel between elbow and ribs to keep form perfect'
  },
  {
    name: 'Band Internal Rotation',
    reps: '2 sets x 10 reps',
    description: 'Elbow pinned to side at 90 degrees. Hold band, pull hand inward across your stomach, keeping your shoulder stable.',
    coachingCue: 'Keep wrist straight; move only from the rotator cuff'
  },
  {
    name: 'Cross-Body / Sleeper Stretch',
    reps: '2 sets x 20 sec per side',
    description: 'Lie on side, arm at 90 degrees out from shoulder. Carefully press your wrist down toward the floor using opposite hand.',
    coachingCue: 'Go strictly to comfortable stretch; NEVER push into pinching pain'
  },
  {
    name: '90/90 Hip Switches',
    reps: '8-10 reps side to side',
    description: 'Sit on ground with knees bent at 90 degrees in front/side. Without lifting hands if possible, rotate hips side to side to change knee direction.',
    coachingCue: 'Unlocks hip internal rotation key to generating force from the legs'
  },
  {
    name: 'Quadruped "Open the Gate" Rotations',
    reps: '8 reps each side',
    description: 'On all fours, place hand behind head. Rotate elbow up to sky, opening your chest, then tuck elbow under towards opposite armpit.',
    coachingCue: 'Follow your elbow with your eyes to get full upper back (T-Spine) stretch'
  },
  {
    name: 'Y-T-W Raises',
    reps: '1 set of 8 reps each letter',
    description: 'Hinge forward at hips. Raise arms straight up at 45 degrees for Ys, straight sideways for Ts, and bent-elbow squeeze for Ws.',
    coachingCue: 'Squeeze the muscles around your shoulder blades on every single rep'
  }
];

export const DAILY_PLANS: DayPlan[] = [
  {
    dayId: 101,
    name: 'Throwing Day 1',
    subtitle: 'Target Throwing & Control (Light Day)',
    description: 'To be performed on non-strength recovery days (or earlier on strength days) if not playing games. High focus on mechanical alignment.',
    tipTitle: 'Target & Release Point',
    tipDescription: 'Focus on hitting the partner in the chest. Emphasize a vertical release point, landing foot straight at target, and front glove tucked smoothly into your body.',
    blocks: [
      { name: 'Step 1: Proper Dynamic Prep', time: '10 min', focus: 'Preheat shoulders and throw-path', category: 'warmup', exercises: ['high-knees', 'walking-lunge', 'arm-circles', 'arm-care-1', 'arm-care-2', 'arm-care-3', 'arm-care-4', 'arm-care-5', 'arm-care-6'] },
      { name: 'Step 2: Hit The Targets', time: '15-20 min', focus: 'Target feedback & glove control', category: 'strength', exercises: ['day-a-step-2'] },
      { name: 'Step 3: Mechanics Check', time: 'Continuous', focus: 'Release point & directional accuracy', category: 'agility', exercises: ['day-a-step-3'] }
    ]
  },
  {
    dayId: 1,
    name: 'Strength Day 2',
    subtitle: 'Lower Body Push & Upper Pull Focus',
    description: 'Prepares throwing muscles and lower body foundation on the first training day of the week.',
    tipTitle: 'Quality over Quantity Focus',
    tipDescription: 'For upper pulling and lower body push (like squats), do not rush the reps. Lower the weight under control (3 seconds down) to build tendon durability needed for pitching.',
    blocks: [
      { name: 'Dynamic Warm-Up', time: '5 min', focus: 'Raise heart rate, prep joints', category: 'warmup', exercises: ['high-knees', 'butt-kicks', 'walking-lunge', 'arm-circles'] },
      { name: 'Movement Skills / Agility', time: '8 min', focus: 'Agility & Landing Mechanics', category: 'agility', exercises: ['cone-shuttle', 'pogo-hops'] },
      { name: 'Strength Circuit', time: '15 min', focus: 'Leg & Pulling strength (2-3 rounds)', category: 'strength', exercises: ['squat', 'band-row', 'glute-bridge', 'farmers-carry'] },
      { name: 'Core & Rotational Power', time: '5 min', focus: 'Trunk stability & side power', category: 'core', exercises: ['front-plank', 'medball-throw'] },
      { name: 'Cool-Down', time: '3 min', focus: 'Static stretching to restore length', category: 'cooldown', exercises: ['stretches'] }
    ]
  },
  {
    dayId: 102,
    name: 'Throwing Day 3',
    subtitle: 'Gradual Long Toss Conditioning',
    description: 'Develops comfortable throwing distance with smooth arc and body momentum over successive weeks.',
    tipTitle: 'Arc and Extension',
    tipDescription: 'Do not throw the ball on a flat line. Put air under the baseball and allow your arm to extend fully. Distance builds arm speed and conditions the shoulder smoothly.',
    blocks: [
      { name: 'Step 1: Arm Care & Base Prep', time: '10 min', focus: 'Shoulder open-gate', category: 'warmup', exercises: ['high-knees', 'walking-lunge', 'arm-circles', 'arm-care-1', 'arm-care-2', 'arm-care-3', 'arm-care-4', 'arm-care-5', 'arm-care-6'] },
      { name: 'Step 2: Progress Outwards', time: '15-20 min', focus: 'Gradual distance arc (up to 75 ft)', category: 'strength', exercises: ['day-b-step-2'] },
      { name: 'Step 3: Step-In Recovery', time: '3 min', focus: 'Static shoulder decompress', category: 'cooldown', exercises: ['day-b-step-3'] }
    ]
  },
  {
    dayId: 2,
    name: 'Strength Day 4',
    subtitle: 'Speed Agility & Upper Push Focus',
    description: 'Midweek session focusing on lateral foot speed, bear crawling body coordination, and torso rotation.',
    tipTitle: 'Core Anti-Rotation',
    tipDescription: 'During side planks and dead bugs, imagine a glass of water balancing on your stomach. Keep your core tight and prevent your hips from rotating toward the floor.',
    blocks: [
      { name: 'Dynamic Warm-Up', time: '5 min', focus: 'Raise heart rate, prep joints', category: 'warmup', exercises: ['high-knees', 'lateral-shuffle', 'inchworm-walkouts', 'arm-circles'] },
      { name: 'Movement Skills / Agility', time: '8 min', focus: 'Speed & multi-directional power', category: 'agility', exercises: ['bear-crawl', 'crab-walk', 'line-hops'] },
      { name: 'Strength Circuit', time: '15 min', focus: 'Unilateral leg work & push muscles', category: 'strength', exercises: ['push-up', 'glute-bridge', 'reverse-lunge', 'balance-reach'] },
      { name: 'Core & Rotational Power', time: '5 min', focus: 'Anti-rotation core', category: 'core', exercises: ['side-plank', 'dead-bug'] },
      { name: 'Cool-Down', time: '3 min', focus: 'Static stretching', category: 'cooldown', exercises: ['stretches'] }
    ]
  },
  {
    dayId: 3,
    name: 'Strength Day 5',
    subtitle: 'Explosiveness & Balanced Strength',
    description: 'End-of-week session optimized for athletic jumping power, carry endurance, and rotator torque.',
    tipTitle: 'Landing Mechanics Tip',
    tipDescription: 'When doing jumping broad-jumps, have him hold his landing pose completely rigid for 2 seconds. This trains knee stabilizer tracks and prevents ACL shear forces. Look for flat feet, soft landing ankles, and zero wobble!',
    blocks: [
      { name: 'Dynamic Warm-Up', time: '5 min', focus: 'Raise heart rate, prep joints', category: 'warmup', exercises: ['butt-kicks', 'walking-lunge', 'lateral-shuffle', 'inchworm-walkouts'] },
      { name: 'Movement Skills / Agility', time: '8 min', focus: 'Explosive jump mechanics', category: 'agility', exercises: ['broad-jump', 'box-jump'] },
      { name: 'Strength Circuit', time: '15 min', focus: 'Complete rotational integration', category: 'strength', exercises: ['squat', 'push-up', 'band-row', 'farmers-carry'] },
      { name: 'Core & Rotational Power', time: '5 min', focus: 'Dynamic trunk speed', category: 'core', exercises: ['dead-bug', 'medball-throw'] },
      { name: 'Cool-Down', time: '3 min', focus: 'Static stretching', category: 'cooldown', exercises: ['stretches'] }
    ]
  }
];

export const PROGRAM_PHASES: ProgramPhase[] = [
  {
    phaseId: 1,
    weeks: [1, 2],
    name: 'Phase 1: Foundation',
    description: 'Establish correct movement patterns, soft landing mechanics, and basic bodyweight resistance limits.',
    strengthRounds: 2,
    circuitRepGuidelines: {
      'squat': '8-10 reps (Bodyweight only)',
      'push-up': '5-8 reps (Flat or Incline)',
      'band-row': '10 reps (Light Band)',
      'glute-bridge': '10 reps (Double Leg)',
      'reverse-lunge': '6 reps/leg (Reverse)',
      'farmers-carry': '20 yds (Water bottles / 5-10lb)',
      'balance-reach': '15 sec/leg'
    }
  },
  {
    phaseId: 2,
    weeks: [3, 4, 5],
    name: 'Phase 2: Progression',
    description: 'Introduce light dumbbell/goblet loading, single-leg bridges to isolate hips, and increased circuit pacing.',
    strengthRounds: 3,
    circuitRepGuidelines: {
      'squat': '10-12 reps (Light Goblet Hold)',
      'push-up': '8-10 reps (Flawless Plank Line)',
      'band-row': '12 reps (Increase Band Tension)',
      'glute-bridge': '8 reps/leg (Single Leg focus)',
      'reverse-lunge': '8 reps/leg (Reverse)',
      'farmers-carry': '30 yds (Increase weight)',
      'balance-reach': '20 sec/leg with reaches'
    }
  },
  {
    phaseId: 3,
    weeks: [6, 7],
    name: 'Phase 3: Athletic Peak',
    description: 'Maximal movement speed, box jumping absorption, multi-angle lateral lunging, and high-tension core planks.',
    strengthRounds: 3,
    circuitRepGuidelines: {
      'squat': '12-15 reps (Goblet, 3-sec slow down)',
      'push-up': '10-12 reps (3-sec slow negatives)',
      'band-row': '12-15 reps (Double bands/thick hold)',
      'glute-bridge': '10 reps/leg (Single Leg with knee hug)',
      'reverse-lunge': '8 reps/leg (Alternate Reverse & Lateral)',
      'farmers-carry': '40 yds (Max proud posture carry)',
      'balance-reach': '20 sec/leg + RDL bird tilts'
    }
  },
  {
    phaseId: 4,
    weeks: [8],
    name: 'Phase 4: Taper & Deload',
    description: 'Reduce training fatigue so muscles recover fully. Rapid bursts, low volume, preparing arms for games.',
    strengthRounds: 2,
    circuitRepGuidelines: {
      'squat': '8-10 reps (Bodyweight, focus on explosive up)',
      'push-up': '6-8 reps (Perfect vertical alignment)',
      'band-row': '10 reps (Posture rowing)',
      'glute-bridge': '8 reps/leg (Peaks holds)',
      'reverse-lunge': '6 reps/leg (Reverse bodyweight)',
      'farmers-carry': '20 yds (Moderate weight)',
      'balance-reach': '15 sec/leg balance focus'
    }
  }
];

export const PITCH_SMART_LIMITS_9_10 = {
  dailyMax: 75,
  restGuidelines: [
    { maxPitches: 20, restNeededDays: 0 },
    { maxPitches: 35, restNeededDays: 1 },
    { maxPitches: 50, restNeededDays: 2 },
    { maxPitches: 65, restNeededDays: 3 },
    { maxPitches: 999, restNeededDays: 4 } // 66+ pitches
  ]
};
