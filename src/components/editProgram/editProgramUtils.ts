import { lb } from "lens-shmens";
import { IPlannerProgramExercise, IPlannerState } from "../../pages/planner/models/types";
import { ILensDispatch } from "../../utils/useLensReducer";
import { IExercisePickerState, ISettings } from "../../types";
import { UndoingFlag_set } from "../../utils/undoingFlag";
import { ExercisePickerUtils_initialSort } from "../exercisePicker/exercisePickerUtils";

export function applyChangesInEditor(plannerDispatch: ILensDispatch<IPlannerState>, cb: () => void): void {
  UndoingFlag_set(true);
  cb();
  plannerDispatch(
    [
      lb<IPlannerState>()
        .p("ui")
        .recordModify((a) => a),
    ],
    "stop-is-undoing"
  );
}

export function pickerStateFromPlannerExercise(
  settings: ISettings,
  plannerExercise?: IPlannerProgramExercise
): IExercisePickerState {
  const templateName =
    plannerExercise != null && plannerExercise.exerciseType == null ? plannerExercise.name : undefined;

  return {
    mode: "program",
    screenStack: ["exercisePicker"],
    sort: ExercisePickerUtils_initialSort(settings.workoutSettings.pickerSort, plannerExercise?.exerciseType),
    filters: {},
    label: plannerExercise?.label,
    templateName,
    exerciseType: plannerExercise?.exerciseType,
    selectedTab: templateName != null ? 1 : 0,
    selectedExercises:
      plannerExercise && plannerExercise.exerciseType != null
        ? [
            {
              type: "adhoc",
              exerciseType: plannerExercise.exerciseType,
              label: plannerExercise.label,
            },
          ]
        : [],
  };
}
