interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-800plus',
    question: 'Co to jest program 800+?',
    answer:
      'Program 800+ to świadczenie rodzinne wypłacane przez polski rząd. Każdy rodzic otrzymuje 800 złotych miesięcznie na każde dziecko w wieku szkolnym (od 1 września w roku szkolnym aż do ukończenia przez dziecko 18 lat). Jest to jedno z największych programów pomocowych w Polsce.',
    category: 'family',
  },
  {
    id: 'faq-800plus-application',
    question: 'Jak złożyć wniosek o 800+?',
    answer:
      'Wniosek o 800+ można złożyć na kilka sposobów:\n' +
      '• Online na stronie emerytura.zus.pl\n' +
      '• Osobiście w ośrodku pomocy społecznej (GOPS/OPS)\n' +
      '• Elektronicznie z profilem zaufanym\n' +
      '• Pocztą\n\n' +
      'Wnioski można składać od lipca roku szkolnego poprzedniego. Wniosek dotyczy całego roku szkolnego od września do sierpnia.',
    category: 'family',
  },
  {
    id: 'faq-who-qualifies',
    question: 'Kto ma prawo do świadczeń?',
    answer:
      'Prawo do większości świadczeń mają:\n' +
      '• Obywatele polscy\n' +
      '• Obywatele UE i EEA przebywający w Polsce\n' +
      '• Osoby posiadające prawo pobytu\n\n' +
      'Dla niektórych świadczeń istnieją kryteria dochodowe. Niektóre świadczenia, jak 800+, nie są uzależnione od dochodów.',
    category: 'benefits',
  },
  {
    id: 'faq-zus-pension',
    question: 'Ile wynosi emerytura z ZUS?',
    answer:
      'Wysokość emerytury z ZUS zależy od wielu czynników:\n' +
      '• Liczby lat pracy i wpłaconych składek\n' +
      '• Wysokości zarobków w ciągu kariery\n' +
      '• Wieku przejścia na emeryturę\n\n' +
      'Bieżące wysokości emerytur różnią się indywidualnie. Średnia emerytura w Polsce wynosi około 2800-3000 złotych. Aby dowiedzieć się dokładnej kwoty, należy złożyć wniosek w oddziale ZUS.',
    category: 'pension',
  },
  {
    id: 'faq-pension-requirements',
    question: 'Jakie są warunki do emerytury?',
    answer:
      'Aby przejść na emeryturę, musisz spełnić:\n' +
      '• Wiek emerytalny (aktualnie 67 lat dla obu płci w Polsce)\n' +
      '• Co najmniej 15 lat ubezpieczenia emerytalnego\n' +
      '• Zrezygnować z pracy na pełny etat\n\n' +
      'Niektóre grupy zawodowe mają uprawnienia emerytalne na niższych warunkach. Możesz również skorzystać z emerytury częściowej lub pracować po osiągnięciu wieku emerytalnego.',
    category: 'pension',
  },
  {
    id: 'faq-payment-schedule',
    question: 'Kiedy są realizowane wypłaty?',
    answer:
      'Terminy wypłat zależą od rodzaju świadczenia:\n' +
      '• 800+ - zwykle do 4. lub 15. dnia każdego miesiąca\n' +
      '• Emerytury ZUS - zależy od numeru PESEL\n' +
      '• Zasiłki - do 4. dnia miesiąca\n\n' +
      'Dokładne terminy dla każdego świadczenia można znaleźć w kalendarzu wypłat na tej stronie.',
    category: 'benefits',
  },
  {
    id: 'faq-payment-methods',
    question: 'Na jakie konto otrzymam pieniądze?',
    answer:
      'Większość świadczeń jest wypłacana na konto bankowe podane we wniosku. Można również wybrać:\n' +
      '• Wypłatę w placówce pocztowej\n' +
      '• Gotówkę w placówce Poczty Polskiej\n\n' +
      'Transfers są zwykle realizowane w ciągu 1-3 dni roboczych od daty oficjalnej wypłaty.',
    category: 'benefits',
  },
  {
    id: 'faq-contact-zus',
    question: 'Jak skontaktować się z ZUS?',
    answer:
      'Kontakt z ZUS:\n' +
      '• Infolinia: 19 115 (połączenie z wewnątrz Polski)\n' +
      '• +48 22 5606 000 (z zagranicy)\n' +
      '• Strona internetowa: www.zus.pl\n' +
      '• Aplikacja mZUS na telefon\n' +
      '• Osobisty odbiór w siedzibie ZUS\n\n' +
      'Godziny obsługi: poniedziałek-piątek 8:00-18:00.',
    category: 'benefits',
  },
  {
    id: 'faq-dobry-start',
    question: 'Co to jest Dobry Start (100 zł)?',
    answer:
      'Dobry Start to jednorazowe świadczenie wypłacane raz w roku (w sierpniu) w wysokości 100 złotych dla każdego ucznia szkoły podstawowej i gimnazjum. Celem programu jest pomoc w zakupie wyposażenia szkolnego (plecak, zeszyty, przybory szkolne itp.).\n\n' +
      'Program obejmuje wszystkie dzieci w wieku szkolnym niezależnie od dochodów rodziny.',
    category: 'family',
  },
  {
    id: 'faq-housing-supplement',
    question: 'Jak otrzymać dodatek mieszkaniowy?',
    answer:
      'Dodatek mieszkaniowy można otrzymać, jeśli:\n' +
      '• Wynajmujesz mieszkanie\n' +
      '• Spłacasz kredyt hipoteczny\n' +
      '• Twój dochód nie przekracza limitów\n\n' +
      'Wysokość dodatku zależy od lokalizacji i dochodów. Wnioski przyjmuje ośrodek pomocy społecznej (GOPS/OPS) w Twojej gminie. Dodatek może wynosić od kilkadziesiąt do kilkaset złotych miesięcznie.',
    category: 'social',
  },
  {
    id: 'faq-unemployment-benefit',
    question: 'Ile wynosi zasiłek dla bezrobotnych?',
    answer:
      'Zasiłek dla bezrobotnych wynosi:\n' +
      '• Pierwszych 3 miesiące - 100% kwoty bazowej (2480 zł w 2025)\n' +
      '• Następnych 3 miesiące - 80% kwoty bazowej (1984 zł w 2025)\n\n' +
      'Aby otrzymać zasiłek, musisz być zarejestrowany w powiatowym urzędzie pracy, a beneficjent musi mieć najmniej 15 lat ubezpieczenia. Zasiłek jest wypłacany przez maksymalnie 6 miesięcy.',
    category: 'social',
  },
  {
    id: 'faq-child-allowance',
    question: 'Jakie są warunki dochodowe do zasiłku na dziecko?',
    answer:
      'Zasiłek na dziecko przysługuje, gdy dochód rodziny nie przekracza:\n' +
      '• 674 zł na osobę (zasiłek 100 zł)\n' +
      '• 764 zł na osobę (zasiłek 135 zł dla rodzin wielodzietnych)\n\n' +
      'Zasiłek na dziecko jest wypłacany od miesiąca, w którym dziecko się urodziło, aż do ukończenia przez dziecko 18 lat. Wnioski przyjmuje ośrodek pomocy społecznej.',
    category: 'family',
  },
  {
    id: 'faq-update-information',
    question: 'Jak zaktualizować moje dane?',
    answer:
      'Dane można zaktualizować:\n' +
      '• Online przez portal PUE ZUS (www.zus.pl)\n' +
      '• Przez aplikację mZUS\n' +
      '• Osobiście w siedzibie ZUS lub GOPS\n' +
      '• Pocztą z podpisem notarialnym\n\n' +
      'Ważne jest aktualizowanie danych o zmianach adresu, stanu cywilnego lub liczby dzieci, aby świadczenia były wypłacane prawidłowo.',
    category: 'benefits',
  },
  {
    id: 'faq-appeal',
    question: 'Jak odwołać się od decyzji?',
    answer:
      'Jeśli nie zgadzasz się z decyzją ZUS lub GOPS:\n' +
      '• Złóż odwołanie w ciągu 30 dni od otrzymania decyzji\n' +
      '• Odwołanie można złożyć osobiście, pocztą lub elektronicznie\n' +
      '• Sprawa trafi do wydziału odwoławczego\n\n' +
      'W razie wątpliwości możesz skonsultować się z pracownikiem socjalnym lub prawnikiem.',
    category: 'benefits',
  },
  {
    id: 'faq-multiple-benefits',
    question: 'Czy mogę otrzymać kilka świadczeń jednocześnie?',
    answer:
      'Tak, możesz otrzymywać wiele świadczeń jednocześnie. Na przykład:\n' +
      '• 800+ + Dobry Start + zasiłek rodzinny\n' +
      '• Emeryturę + dodatek mieszkaniowy\n' +
      '• Emeryturę + rentę\n\n' +
      'Jednak dla niektórych kombinacji świadczeń obowiązują limity dochodowe. W razie wątpliwości skontaktuj się z ZUS lub ośrodkiem pomocy społecznej.',
    category: 'benefits',
  },
];
