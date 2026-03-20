import Rive, { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import twentyYearsSrc from './20years.riv?url';

const twentyYearsLayout = new Layout({
  fit: Fit.Cover,
  alignment: Alignment.Center
});

function TwentyYears() {
  return (
    <div className="twenty-years" aria-label="20 years animation">
      <Rive
        src={twentyYearsSrc}
        layout={twentyYearsLayout}
        shouldResizeCanvasToContainer
        className="twenty-years__canvas"
      />
    </div>
  );
}

export default TwentyYears;
