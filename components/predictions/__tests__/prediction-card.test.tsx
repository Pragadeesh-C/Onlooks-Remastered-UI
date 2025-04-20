import { test, expect } from "bun:test";

const mockPrediction = {
  Student_Name: "John Doe",
  ML_Prediction: "Will Continue",
  Similar_Students: [],
  Insights: "The student shows good academic performance with regular attendance. Recommended scholarships such as Merit Scholarship, Academic Excellence Award. Key factors include 'Good Attendance', 'Strong Academic Performance'."
};

test('extracts risk factors correctly', () => {
  const riskFactors = mockPrediction.Insights.match(/'([^']+)'/g)
    ?.map(factor => factor.replace(/'/g, ""))
    .filter(Boolean) || [];

  expect(riskFactors).toEqual([
    'Good Attendance',
    'Strong Academic Performance'
  ]);
});

test('extracts scholarships correctly', () => {
  const scholarships = mockPrediction.Insights.match(/such as ([^.]+)/i)?.[1].split(", ") || [];

  expect(scholarships).toEqual([
    'Merit Scholarship',
    'Academic Excellence Award'
  ]);
});

test('identifies dropout prediction correctly', () => {
  const dropoutPrediction = {
    ...mockPrediction,
    ML_Prediction: "Will DropOut"
  };
  
  const isDropout = dropoutPrediction.ML_Prediction === "Will DropOut";
  expect(isDropout).toBe(true);
});

test('identifies continue prediction correctly', () => {
  const isDropout = mockPrediction.ML_Prediction === "Will DropOut";
  expect(isDropout).toBe(false);
}); 