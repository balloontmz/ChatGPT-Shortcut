/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useMemo, useEffect , useCallback } from 'react';
import clsx from 'clsx';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Translate, { translate } from '@docusaurus/Translate';
import { useHistory, useLocation } from '@docusaurus/router';
import { usePluralForm } from '@docusaurus/theme-common';
import { debounce } from 'lodash';

import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import FavoriteIcon from '@site/src/components/svgIcons/FavoriteIcon';
import {
  sortedUsers,
  Tags,
  TagList,
  type User,
  type TagType,
} from '@site/src/data/users';
import Heading from '@theme/Heading';
import ShowcaseTagSelect, {
  readSearchTags,
} from './_components/ShowcaseTagSelect';
import ShowcaseFilterToggle, {
  type Operator,
  readOperator,
} from './_components/ShowcaseFilterToggle';
import ShowcaseCard from './_components/ShowcaseCard';
import ShowcaseTooltip from './_components/ShowcaseTooltip';
import SimpleModal from './_components/QrcodeDialog';

import styles from './styles.module.css';


const TITLE = translate({ message: 'Balloon AI - 专注于AIGC周边产品探索与研发' });
const DESCRIPTION = translate({
  message: 'Balloon AI，专注于AIGC周边产品探索与研发',
});
const SUBMIT_URL = 'https://github.com/balloontmz/ChatGPT-Shortcut';

type UserState = {
  scrollTopPosition: number;
  focusedElementId: string | undefined;
};

function restoreUserState(userState: UserState | null) {
  const { scrollTopPosition, focusedElementId } = userState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  // @ts-expect-error: if focusedElementId is undefined it returns null
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({ top: scrollTopPosition });
}

export function prepareUserState(): UserState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }

  return undefined;
}

const SearchNameQueryKey = 'name';

function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: Operator,
  searchName: string | null,
) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    // 搜索范围
    users = users.filter((user) =>
      (user.title + user.description + user.desc_cn + user.remark + user.desc_en+ user.remark_en).toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (selectedTags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return selectedTags.every((tag) => user.tags.includes(tag));
    }
    return selectedTags.some((tag) => user.tags.includes(tag));
  });
}

function useFilteredUsers() {
  const location = useLocation<UserState>();
  const [operator, setOperator] = useState<Operator>('OR');
  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [searchName, setSearchName] = useState<string | null>(null);
  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client
  // hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setSearchName(readSearchName(location.search));
    restoreUserState(location.state);
  }, [location]);

  return useMemo(
    () => filterUsers(sortedUsers, selectedTags, operator, searchName),
    [selectedTags, operator, searchName],
  );
}

function ShowcaseHeader() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">AIGC，提高生产力，优化工作流程</Heading>
      <p>{DESCRIPTION} &nbsp;&nbsp;&nbsp;&nbsp; <a href="https://jq.qq.com/?_wv=1027&k=PWsc1X0f" target="_blank" >加入QQ群</a></p>
      <Link className="button button--success" to="https://ai.gap-year.top/ai-chat">
        <Translate id="showcase.header.button">
          开始对话 👉
        </Translate>
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link className="button button--warning" onClick={toggleModal}>
        <Translate id="showcase.header.button">
            打赏 💸🙌🌟 
        </Translate>
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link className="button button--secondary" to={SUBMIT_URL}>
        <Translate id="showcase.header.button">
          🙏 请添加你的提示词
        </Translate>
      </Link>
      <SimpleModal modalIsOpen={modalIsOpen} toggleModal={toggleModal} />
    </section>
  );
}

function useSiteCountPlural() {
  const { selectMessage } = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: 'showcase.filters.resultCount',
          description:
            'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: '{sitesCount} prompts',
        },
        { sitesCount },
      ),
    );
}

function ShowcaseFilters() {
  const filteredUsers = useFilteredUsers();
  const siteCountPlural = useSiteCountPlural();
  return (
    <section className="container margin-top--l margin-bottom--lg">
      <div className={clsx('margin-bottom--sm', styles.filterCheckbox)}>
        <div>
          <Heading as="h2">
            <Translate id="showcase.filters.title">Filters</Translate>
          </Heading>
          <span>{siteCountPlural(filteredUsers.length)}</span>
        </div>
        <Link style={{
          display: 'inline-block',
          backgroundColor: '#18816a',
          color: 'var(--site-color-favorite-background)',
          padding: '5px 10px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontSize: '8px',
          fontWeight: 'bold',
          marginRight: '8px',
        }} to="/cn" title="将提示词的默认语言切换为中文。">
          CN
        </Link>
        <ShowcaseFilterToggle />
      </div>
      <ul className={clsx('clean-list', styles.checkboxList)}>
        {TagList.map((tag, i) => {
          const { label, description, color } = Tags[tag];
          const id = `showcase_checkbox_id_${tag}`;

          return (
            <li key={i} className={styles.checkboxListItem}>
              <ShowcaseTooltip
                id={id}
                text={description}
                anchorEl="#__docusaurus">
                <ShowcaseTagSelect
                  tag={tag}
                  id={id}
                  label={label}
                  icon={
                    tag === 'favorite' ? (
                      <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                    ) : (
                      <span
                        style={{
                          backgroundColor: color,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          marginLeft: 8,
                        }}
                      />
                    )
                  }
                />
              </ShowcaseTooltip>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const favoriteUsers = sortedUsers.filter((user) =>
  user.tags.includes('favorite'),
);
const otherUsers = sortedUsers.filter(
  (user) => !user.tags.includes('favorite'),
);

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
  }, [location]);

  useEffect(() => {
    const searchbar = document.getElementById('searchbar');
    if (searchbar) {
      searchbar.focus();
    }
  }, [value]);

  const updateSearch = useCallback(
    debounce((searchValue: string) => {
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (searchValue) {
        newSearch.set(SearchNameQueryKey, searchValue);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }, 800), //搜索延时
    [location, history]
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (window.innerWidth >= 768) { // PC 端
      setValue(e.currentTarget.value);
      updateSearch(e.currentTarget.value);
    } else { // 移动端
      setValue(e.currentTarget.value);
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (e.currentTarget.value) {
        newSearch.set(SearchNameQueryKey, e.currentTarget.value);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        id="searchbar"
        placeholder={translate({
          message: 'Search for prompts...',
          id: 'showcase.searchBar.placeholder',
        })}
        value={value ?? undefined}
        onInput={handleInput}
      />
    </div>
  );
}

// 不区分移动端、PC 端，都使用 800ms 延时
/* function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
  }, [location]);

  useEffect(() => {
    const searchbar = document.getElementById('searchbar');
    if (searchbar) {
      searchbar.focus();
    }
  }, [value]);

  const updateSearch = useCallback(
    debounce((searchValue: string) => {
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (searchValue) {
        newSearch.set(SearchNameQueryKey, searchValue);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }, 800), //搜索延时
    [location, history]
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    updateSearch(e.currentTarget.value);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        id="searchbar"
        placeholder={translate({
          message: 'Search for prompts...',
          id: 'showcase.searchBar.placeholder',
        })}
        value={value ?? undefined}
        onInput={handleInput}
      />
    </div>
  );
} */

function ShowcaseCards() {
  const filteredUsers = useFilteredUsers();

  if (filteredUsers.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="container padding-vert--md text--center">
          <Heading as="h2">
            <Translate id="showcase.usersList.noResult">😒 找不到结果，请缩短搜索词</Translate>
          </Heading>
          <SearchBar />
        </div>
      </section>
    );
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length === sortedUsers.length ? (
        <>
          <div className={styles.showcaseFavorite}>
            <div className="container">
              <div
                className={clsx(
                  'margin-bottom--md',
                  styles.showcaseFavoriteHeader,
                )}>
                <Heading as="h2">
                  <Translate id="showcase.favoritesList.title">
                    Our favorites
                  </Translate>
                </Heading>
                <FavoriteIcon svgClass={styles.svgIconFavorite} />
                <SearchBar />
              </div>
              <ul
                className={clsx(
                  'clean-list',
                  styles.showcaseList,
                )}>
                {favoriteUsers.map((user) => (
                  <ShowcaseCard key={user.title} user={user} />
                ))}
              </ul>
            </div>
          </div>
          <div className="container margin-top--lg">
            <Heading as="h2" className={styles.showcaseHeader}>
              <Translate id="showcase.usersList.allUsers">All prompts</Translate>
            </Heading>
            <ul className={clsx('clean-list', styles.showcaseList)}>
              {otherUsers.map((user) => (
                <ShowcaseCard key={user.title} user={user} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="container">
          <div
            className={clsx(
              'margin-bottom--md',
              styles.showcaseFavoriteHeader,
            )}>
            <SearchBar />
          </div>
          <ul className={clsx('clean-list', styles.showcaseList)}>
            {filteredUsers.map((user) => (
              <ShowcaseCard key={user.title} user={user} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function Showcase(): JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters />
        <ShowcaseCards />
      </main>
    </Layout>
  );
}
