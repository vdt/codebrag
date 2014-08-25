package com.softwaremill.codebrag.usecases.user

import org.scalatest.matchers.ShouldMatchers
import org.scalatest.mock.MockitoSugar
import org.scalatest.{BeforeAndAfter, FlatSpec}
import com.softwaremill.codebrag.service.user.RegisterService
import com.softwaremill.codebrag.licence.LicenceService
import com.softwaremill.codebrag.dao.user.UserDAO
import org.mockito.Mockito._

class RegisterNewUserUseCaseSpec extends FlatSpec with ShouldMatchers with MockitoSugar with BeforeAndAfter {

  var useCase: RegisterNewUserUseCase = _
  var registerService: RegisterService = _
  var licenceService: LicenceService = _
  var userDao: UserDAO = _

  before {
    registerService = mock[RegisterService]
    licenceService = mock[LicenceService]
    userDao = mock[UserDAO]

    useCase = new RegisterNewUserUseCase(licenceService, registerService, userDao)
  }

  it should "allow new user to be registered when it doesn't exceed max users licenced" in {
    // given
    when(licenceService.maxUsers).thenReturn(10)
    when(userDao.countAllActive()).thenReturn(5)

    // when
    val user = UserToRegister("john", "john@codebrag.com", "secret", "123456")
    useCase.execute(user)

    // then
    verify(registerService).register(user.login, user.email, user.password, user.invitationCode)
  }

  it should "not allow new user to be registered when it exceeds max users licenced" in {
    // given
    when(licenceService.maxUsers).thenReturn(10)
    when(userDao.countAllActive()).thenReturn(10)

    // when
    val user = UserToRegister("john", "john@codebrag.com", "secret", "123456")
    val Left(result) = useCase.execute(user)

    // then
    verifyZeroInteractions(registerService)

    result.flatMap(_._2) should be(List(RegisterNewUserUseCase.MaxUsersExceededMessage))
  }

}
