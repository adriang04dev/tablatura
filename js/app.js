import { miFortaleza } from '../data/mi-fortaleza.js';
import { amigoDeDios } from '../data/amigo-de-dios.js';

const songs = [miFortaleza, amigoDeDios];
const songSelect = document.querySelector('#song-select');
const songTitle = document.querySelector('#song-title');
const sectionsGrid = document.querySelector('.sections-grid');
const selectedSongStorageKey = 'tablatura-selected-song';

function createSection(label) {
  const section = document.createElement('section');
  section.className = 'section';

  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'section-label';
  sectionLabel.textContent = label;
  section.appendChild(sectionLabel);

  return section;
}

function renderTab(section, strings) {
  const tabBlock = document.createElement('div');
  tabBlock.className = 'tab-block';

  strings.forEach((string) => {
    const row = document.createElement('div');
    row.className = 'string-row';

    const name = document.createElement('div');
    name.className = `string-name ${string.cls}`;
    name.textContent = string.name;
    row.appendChild(name);

    const wrap = document.createElement('div');
    wrap.className = 'string-line-wrap';

    const lineBackground = document.createElement('div');
    lineBackground.className = 'string-line-bg';
    wrap.appendChild(lineBackground);

    const content = document.createElement('div');
    content.className = 'tab-content';

    if (string.format === 'notes') {
      string.content.split('-').forEach((value, index, notes) => {
        const note = document.createElement('span');
        note.className = 'tab-char note note-name';
        note.textContent = value;
        content.appendChild(note);

        if (index < notes.length - 1) {
          const separator = document.createElement('span');
          separator.className = 'tab-char dash';
          separator.textContent = '-';
          content.appendChild(separator);
        }
      });
    } else {
      let index = 0;
      while (index < string.content.length) {
        if (/\d/.test(string.content[index])) {
          let value = '';
          while (index < string.content.length && /\d/.test(string.content[index])) {
            value += string.content[index];
            index += 1;
          }

          const note = document.createElement('span');
          note.className = 'tab-char note';
          note.textContent = value;
          if (value.length > 1) note.style.width = `${value.length * 10 + 6}px`;
          content.appendChild(note);
        } else {
          const dash = document.createElement('span');
          dash.className = 'tab-char dash';
          dash.textContent = string.content[index];
          content.appendChild(dash);
          index += 1;
        }
      }
    }

    wrap.appendChild(content);
    row.appendChild(wrap);
    tabBlock.appendChild(row);
  });

  section.appendChild(tabBlock);
}

function renderSong(song) {
  sectionsGrid.replaceChildren();
  songTitle.textContent = song.title;

  song.sections.forEach((sectionData) => {
    const section = createSection(sectionData.label);

    renderTab(section, sectionData.strings);

    sectionsGrid.appendChild(section);
  });
}

songs.forEach((song) => {
  const option = document.createElement('option');
  option.value = song.id;
  option.textContent = song.title;
  songSelect.appendChild(option);
});

songSelect.addEventListener('change', () => {
  const selectedSong = songs.find((song) => song.id === songSelect.value);
  if (!selectedSong) return;

  localStorage.setItem(selectedSongStorageKey, selectedSong.id);
  renderSong(selectedSong);
});

const savedSongId = localStorage.getItem(selectedSongStorageKey);
const initialSong = songs.find((song) => song.id === savedSongId) ?? miFortaleza;

songSelect.value = initialSong.id;
renderSong(initialSong);
