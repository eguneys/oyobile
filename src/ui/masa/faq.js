import i18n from '../../i18n';
import backbutton from '../../backbutton';
import * as helper from '../helper';
import router from '../../router';

export default {
  controller: function(masa) {
    let isOpen = false;

    function open() {
      router.backbutton.stack.push(close);
      isOpen = true;
    }
    function close(fromBB) {
      if (fromBB !== 'backbutton' && isOpen) router.backbutton.stack.pop();
      isOpen = false;
    }

    return {
      open,
      close,
      isOpen: function() { return isOpen; },
      masa
    };
  },
  view: function(ctrl) {
    if (!ctrl.isOpen()) return null;
    const masa = ctrl.masa;

    if (!masa) return null;

    return (
      <div className="modal" id="masaFaqModal" oncreate={helper.slidesInUp}>
        <header>
          <button className="modal_close" data-icon="L"
                  oncreate={helper.ontap(helper.slidesOutDown(ctrl.close, "masaFaqModal"))}/>
          <h2>{i18n('masaFAQ')}</h2>
        </header>
        <div className="modal_content">
          <div className="masaFaq">

            <h2>Puanlı mı?</h2>

            { masa.rated === undefined ?
            'Bazı masalar puanlıdır ve reytinginizi etkiler.' :
            masa.rated ?
              'Bu masa puanlıdır ve reytinginizi etkiler.' :
              'Bu masa puanlı *değildir* ve reytinginizi *etkilemez*.'
            }

            <h2> Puanlar nasıl hesaplanır? </h2>

            Masaya katılımda her oyuncu ortaya el sayısı kadar puanını koyar. Masa sonunda ortadaki puanlar şöyle dağıtılır:

            <ul>
              <li>1. %50 puan</li>
              <li>2. %25 puan</li>
              <li>3. %15 puan</li>
              <li>4. %10 puan</li>
            </ul>

            Örneğin 10 ellik bir oyunda oyuncuların puanları 1500 olsun.

            Masaya katıldıklarında puanları 1490 olur. Ortada toplam 40 puan vardır, ve şöyle dağıtılır:

            <ul>
              <li>1. +20 = 1510</li>
              <li>2. +10 = 1500</li>
              <li>3. +6 = 1496</li>
              <li>4. +4 = 1494</li>
            </ul>

            Masa bitmeden ayrılan oyuncu puan alamaz.

            <h2> Kazanan nasıl belirlenir? </h2>

            Masada bütün eller oynandıktan sonra en az cezası olan oyuncu galip ilan edilir.

            <h2> Masada eslestirme nasil yapilir? </h2>

            Masaya 4 oyuncu katildiginda el baslar. Bir el bittikten sonra yeni el baslar, yeni ele katilmak icin oyuncular masaya geri donmelidir.

            <h2> Masa ne zaman biter? </h2>

            Masada el sayısı kadar oyun oynandığında masa biter.

            <h2> Oyundan ayrılma </h2>

            Oyun devam ederken oyundan ayrilan oyuncu masadan atilir, ve o el iptal olur. Masa bitmeden masadan ayrılan oyuncu puan alamaz.

            <h2> Diğer önemli kurallar </h2>

            Siraniz geldiginde, oyanama sürenizi aşarsanız sistem sizin yerinize oynar.
          </div>
        </div>
      </div>
    );
  }
};
