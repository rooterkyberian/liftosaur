import "mocha";
import { expect } from "chai";
import {
  ExercisePickerUtils_getSortRating,
  ExercisePickerUtils_initialSort,
  IExercisePickerSortCtx,
} from "../src/components/exercisePicker/exercisePickerUtils";
import { Exercise_get, Exercise_toKey } from "../src/models/exercise";
import { Settings_build } from "../src/models/settings";

describe("ExercisePickerUtils", () => {
  describe(".getSortRating()", () => {
    const settings = Settings_build();
    const squat = Exercise_get({ id: "squat", equipment: "barbell" }, {});
    const bench = Exercise_get({ id: "benchPress", equipment: "barbell" }, {});
    const deadlift = Exercise_get({ id: "deadlift", equipment: "barbell" }, {});

    function ctx(usageCounts: Partial<Record<string, number>>): IExercisePickerSortCtx {
      return { sort: "most_popular", filters: {}, usageCounts };
    }

    it("sorts by usage count descending", () => {
      const c = ctx({ [Exercise_toKey(squat)]: 2, [Exercise_toKey(bench)]: 5 });
      expect(ExercisePickerUtils_getSortRating(squat, bench, settings, c)).to.be.greaterThan(0);
      expect(ExercisePickerUtils_getSortRating(bench, squat, settings, c)).to.be.lessThan(0);
    });

    it("breaks ties alphabetically and treats missing counts as zero", () => {
      const c = ctx({ [Exercise_toKey(squat)]: 3, [Exercise_toKey(bench)]: 3 });
      expect(ExercisePickerUtils_getSortRating(bench, squat, settings, c)).to.be.lessThan(0);
      expect(ExercisePickerUtils_getSortRating(deadlift, squat, settings, c)).to.be.greaterThan(0);
      expect(ExercisePickerUtils_getSortRating(bench, deadlift, settings, c)).to.be.lessThan(0);
    });
  });

  describe(".initialSort()", () => {
    it("keeps most_popular even without an exercise type", () => {
      expect(ExercisePickerUtils_initialSort("most_popular", undefined)).to.eql("most_popular");
      expect(ExercisePickerUtils_initialSort("most_popular", { id: "squat", equipment: "barbell" })).to.eql(
        "most_popular"
      );
    });

    it("downgrades similar_muscles to name_asc only without an exercise type", () => {
      expect(ExercisePickerUtils_initialSort("similar_muscles", undefined)).to.eql("name_asc");
      expect(ExercisePickerUtils_initialSort("similar_muscles", { id: "squat", equipment: "barbell" })).to.eql(
        "similar_muscles"
      );
    });

    it("defaults to name_asc when nothing is persisted", () => {
      expect(ExercisePickerUtils_initialSort(undefined, undefined)).to.eql("name_asc");
    });
  });
});
