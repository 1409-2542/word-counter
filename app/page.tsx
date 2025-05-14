'use client';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import { saveAs } from 'file-saver';
import { useTheme } from 'next-themes';

// Flesch-Kincaid (Simple version)
function getReadingLevel(text: string): string {
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const flesch =
    206.835 -
    1.015 * (wordCount / sentenceCount || 1) -
    84.6 * (syllableCount / wordCount || 1);

  if (flesch > 90) return 'Very Easy';
  if (flesch > 80) return 'Easy';
  if (flesch > 70) return 'Fairly Easy';
  if (flesch > 60) return 'Standard';
  if (flesch > 50) return 'Fairly Difficult';
  if (flesch > 30) return 'Difficult';
  return 'Very Difficult';
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

const stopwords = new Set(['the','is','in','at','of','on','and','a','to','it','for','with','as','was','that','this','an','be']);

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const { theme, setTheme } = useTheme();

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === '' ? [] : trimmed.split(/\s+/);
    const wordCount = words.length;
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const readingTime = Math.ceil(wordCount / 200);

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    const longestWord = words.reduce((longest, word) =>
      word.length > longest.length ? word : longest, '');

    const averageWordLength = wordCount === 0
      ? 0
      : (words.join('').length / wordCount).toFixed(2);

    const frequencyMap: Record<string, number> = {};
    words
      .map(word => word.toLowerCase().replace(/[^\w]/g, ''))
      .filter(word => word && !stopwords.has(word))
      .forEach(word => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      });

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const readingLevel = getReadingLevel(text);

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      readingTime,
      sentenceCount,
      paragraphCount,
      longestWord,
      averageWordLength,
      topKeywords,
      readingLevel
    };
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const exportAsTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'worddash-text.txt');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} py-10 px-4 sm:px-6 lg:px-8`}>
      <Head>
        <title>WordDash – The Ultimate Word Counter</title>
        <meta name="description" content="The most powerful word counter online. Stats, AI tools, reading time, readability and more!" />
      </Head>

      <main className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">WordDash 🚀</h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-sm border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm min-h-[200px] text-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white text-black"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">📋 Copy</button>
          <button onClick={exportAsTxt} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">💾 Export</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 bg-white text-black p-4 rounded-xl shadow dark:bg-gray-800 dark:text-white">
          <Stat label="Words" value={stats.wordCount} />
          <Stat label="Characters" value={stats.charCount} />
          <Stat label="Characters (No Spaces)" value={stats.charCountNoSpaces} />
          <Stat label="Sentences" value={stats.sentenceCount} />
          <Stat label="Paragraphs" value={stats.paragraphCount} />
          <Stat label="Reading Time" value={`${stats.readingTime} min`} />
          <Stat label="Longest Word" value={stats.longestWord || '-'} />
          <Stat label="Avg. Word Length" value={stats.averageWordLength} />
          <Stat label="Reading Level" value={stats.readingLevel} />
        </div>

        <div className="mt-8 bg-white text-black p-4 rounded-xl shadow dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-2">Top Keywords</h2>
          {stats.topKeywords.length > 0 ? (
            <ul className="list-disc list-inside">
              {stats.topKeywords.map(([word, count]) => (
                <li key={word}>
                  <strong>{word}</strong>: {count} use{count > 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No significant keywords found.</p>
          )}
        </div>

        <p className="mt-10 text-sm text-gray-500 text-center">
          Built for writers, creators & SEO pros – WordDash™ 2025.
        </p>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{label}</p>
      <p className="text-2xl font-semibold break-words">{value}</p>
    </div>
  );
}