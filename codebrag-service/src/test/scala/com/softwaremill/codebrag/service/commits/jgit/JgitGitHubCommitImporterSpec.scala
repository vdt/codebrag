import com.softwaremill.codebrag.dao.{RepositoryStatusDAO, CommitInfoDAO}
  var repoStatusDaoMock: RepositoryStatusDAO = _
    repoStatusDaoMock = mock[RepositoryStatusDAO]
    given(repoStatusDaoMock.get(TestRepoData.repositoryName)).willReturn(Some(lastCommit.getId.name))
      def repoStatusDao = repoStatusDaoMock