import { Suspense, type FC } from 'react';
import { useRoutes } from 'react-router-dom';
import generatedRoutes from '~react-pages';
import { setupLayouts } from 'virtual:generated-layouts';

const App: FC = () => {
  const routes = setupLayouts(generatedRoutes);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  );
};

export default App;
