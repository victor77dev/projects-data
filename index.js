const fs = require('fs');
import getReactRocksData from './reactRocksData';

let projectData = null;

async function loadReactProjectData() {
  const updateReactRocksData = process.argv ? (process.argv.length > 2 && process.argv[2] === 'update') : false;
  // Download latest data from React Rocks if `npm run update` is called
  if (updateReactRocksData) {
    projectData = await getReactRocksData();
    return true;
  }
  // Load existing formattedData.json if `npm start` is called
  try {
    projectData = require('./formattedData.json');
    return true;
  } catch(err) {
    // Download latest data from React Rocks if formattedData.json cannot be loaded
    console.log('Failed to load data from formattedData.json. Going to Download it again.');
    projectData = await getReactRocksData();
  }
}

async function saveAllReactRocksData() {
  // Load React Rocks data
  await loadReactProjectData();
  const { projects, tags, project_tags: projectTags } = projectData;

  // Update projects data
  const updatedProjectsJson = projects.reduce((list, data, index) => {
    // Rename the keys in projects data
    const {
      c: codeUrl,
      d: demoUrl,
      g: blogUrl,
      i: description,
      n: name,
      s: documentUrl,
      ...unknown,
    } = data;
    const renameData = {
      index,
      codeUrl,
      demoUrl,
      blogUrl,
      description,
      name,
      documentUrl,
      ...unknown,
    }
    // Find the project tags
    const curProjectTags = projectTags[index];
    const dataTags = curProjectTags !== null ? curProjectTags.map((tagIndex) => tags[tagIndex]) : [];
    // Add tags to data
    const renameDataWithTags = { tags: dataTags, ...renameData };
    list.projects[name] = renameData;
    list.projectsWithTags[name] = renameDataWithTags;
    return list;
  }, { projects: {}, projectsWithTags: {} });
  fs.writeFile('projects.json', JSON.stringify(updatedProjectsJson.projects, null, 2));
  fs.writeFile('projectsWithTags.json', JSON.stringify(updatedProjectsJson.projectsWithTags, null, 2));

  // All tags data
  const updatedTagsJson = tags.reduce((list, data, index) => {
    list[index] = data;
    return list;
  }, {});
  fs.writeFile('tags.json', JSON.stringify(updatedTagsJson, null, 2));

  // Save project data with tags and all tags data
  const allData = { projects: updatedProjectsJson.projectsWithTags, tags: updatedTagsJson };
  fs.writeFile('projectsAllData.json', JSON.stringify(allData, null, 2));
}

saveAllReactRocksData();