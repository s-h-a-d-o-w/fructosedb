import * as React from 'react';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {changeTranslationTarget} from '../store/actions';

export const TranslationDropdown: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    function handleChange(event: Event) {
      if (event.target instanceof HTMLSelectElement) {
        dispatch(changeTranslationTarget(event.target.value));
      }
    }

    // google-translate.js fetches external assets from Google, which
    // may take a while...
    (function waitForGoogleTranslate() {
      if (window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {pageLanguage: 'en'},
          'google_translate_element'
        );

        document
          .getElementsByClassName('goog-te-combo')[0]
          .addEventListener('change', handleChange);

        return;
      }

      setTimeout(waitForGoogleTranslate, 100);
    })();
  }, [dispatch]);

  return <div id="google_translate_element" />;
};
